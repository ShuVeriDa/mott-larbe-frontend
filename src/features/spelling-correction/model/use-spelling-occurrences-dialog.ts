"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import type { SpellingOccurrence, SpellingOccurrencesDialogState } from "./types";

const CONTEXT_CHARS = 40;
const CLOSED: SpellingOccurrencesDialogState = {
	isOpen: false,
	wrongForm: "",
	correctForm: "",
	occurrences: [],
};

const extractContext = (fullText: string, from: number, to: number): { before: string; after: string } => {
	const rawBefore = fullText.slice(Math.max(0, from - CONTEXT_CHARS), from);
	const rawAfter = fullText.slice(to, to + CONTEXT_CHARS);

	// trim to nearest word boundary so we don't cut mid-word
	const before = rawBefore.replace(/^\S*\s?/, "").trimStart();
	const after = rawAfter.replace(/\s?\S*$/, "").trimEnd();

	return { before, after };
};

const findOccurrences = (editor: Editor, wrongForm: string, correctForm: string): SpellingOccurrence[] => {
	const doc = editor.state.doc;
	const fullText = doc.textContent;
	const pattern = new RegExp(wrongForm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
	const occurrences: SpellingOccurrence[] = [];

	// Build a cumulative offset map: for each text offset we can resolve the doc pos.
	// textChunks[i].startOffset = position of chunk[i].text[0] in fullText
	const textChunks: { text: string; pos: number; startOffset: number }[] = [];
	let cumulative = 0;
	doc.descendants((node, pos) => {
		if (node.isText && node.text) {
			textChunks.push({ text: node.text, pos, startOffset: cumulative });
			cumulative += node.text.length;
		}
	});

	// Converts a fullText offset to the corresponding absolute ProseMirror doc position.
	// Returns null if the offset falls inside a node boundary gap (shouldn't happen with textContent).
	const textOffsetToDocPos = (offset: number): number | null => {
		for (const chunk of textChunks) {
			if (offset >= chunk.startOffset && offset < chunk.startOffset + chunk.text.length) {
				return chunk.pos + (offset - chunk.startOffset);
			}
		}
		return null;
	};

	let match: RegExpExecArray | null;
	let index = 0;
	while ((match = pattern.exec(fullText)) !== null) {
		const textFrom = match.index;
		const textTo = textFrom + match[0].length;

		const from = textOffsetToDocPos(textFrom);
		// `to` must point one past the last character — resolve end of match independently
		// so cross-node matches get the correct doc position even if from/to are in different chunks.
		const toResolved = textTo > 0 ? textOffsetToDocPos(textTo - 1) : null;
		if (from === null || toResolved === null) continue;

		const to = toResolved + 1;
		const { before, after } = extractContext(fullText, textFrom, textTo);

		occurrences.push({
			index,
			originalText: match[0],
			correctForm,
			before,
			after,
			from,
			to,
		});
		index++;
	}

	return occurrences;
};

export const useSpellingOccurrencesDialog = (editor: Editor | null) => {
	const [dialog, setDialog] = useState<SpellingOccurrencesDialogState>(CLOSED);
	const [deselected, setDeselected] = useState<Set<number>>(new Set());

	const open = (wrongForm: string, correctForm: string) => {
		if (!editor) return;
		const occurrences = findOccurrences(editor, wrongForm, correctForm);
		setDialog({ isOpen: true, wrongForm, correctForm, occurrences });
		setDeselected(new Set());
	};

	const close = () => {
		setDialog(CLOSED);
		setDeselected(new Set());
	};

	const handleToggle = (index: number) => {
		setDeselected(prev => {
			const next = new Set(prev);
			if (next.has(index)) {
				next.delete(index);
			} else {
				next.add(index);
			}
			return next;
		});
	};

	const selectedCount = dialog.occurrences.length - deselected.size;
	const allChecked = deselected.size === 0;
	const someChecked = deselected.size > 0 && deselected.size < dialog.occurrences.length;

	const handleToggleAll = () => {
		if (allChecked || someChecked) {
			setDeselected(new Set(dialog.occurrences.map(o => o.index)));
		} else {
			setDeselected(new Set());
		}
	};

	const handleApply = () => {
		if (!editor) return;

		// Apply replacements in reverse order so earlier positions stay valid
		const toFix = dialog.occurrences
			.filter(o => !deselected.has(o.index))
			.sort((a, b) => b.from - a.from);

		for (const occ of toFix) {
			editor.commands.applySpellingFix(occ.from, occ.to, occ.correctForm);
		}

		close();
	};

	return {
		dialog,
		deselected,
		selectedCount,
		allChecked,
		someChecked,
		open,
		close,
		handleToggle,
		handleToggleAll,
		handleApply,
	};
};
