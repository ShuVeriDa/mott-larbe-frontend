"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import type { SpellingMatchType } from "@/entities/spelling-dictionary";
import { buildMatchRegex } from "@/entities/spelling-dictionary";
import type { SpellingOccurrence, SpellingOccurrencesDialogState } from "./types";

const CONTEXT_CHARS = 40;
const CLOSED: SpellingOccurrencesDialogState = {
	isOpen: false,
	wrongForm: "",
	matchType: "substring",
	correctForm: "",
	correctForms: [],
	occurrences: [],
};

const extractContext = (fullText: string, from: number, to: number): { before: string; after: string } => {
	const rawBefore = fullText.slice(Math.max(0, from - CONTEXT_CHARS), from);
	const rawAfter = fullText.slice(to, to + CONTEXT_CHARS);
	const before = rawBefore.replace(/^\S*\s?/, "").trimStart();
	const after = rawAfter.replace(/\s?\S*$/, "").trimEnd();
	return { before, after };
};

const findOccurrences = (
	editor: Editor,
	wrongForm: string,
	matchType: SpellingMatchType,
	correctForm: string,
	correctForms: string[],
): SpellingOccurrence[] => {
	const doc = editor.state.doc;
	const fullText = doc.textContent;
	const pattern = buildMatchRegex(wrongForm, matchType);
	const occurrences: SpellingOccurrence[] = [];

	const textChunks: { text: string; pos: number; startOffset: number }[] = [];
	let cumulative = 0;
	doc.descendants((node, pos) => {
		if (node.isText && node.text) {
			textChunks.push({ text: node.text, pos, startOffset: cumulative });
			cumulative += node.text.length;
		}
	});

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
		const toResolved = textTo > 0 ? textOffsetToDocPos(textTo - 1) : null;
		if (from === null || toResolved === null) continue;

		const to = toResolved + 1;
		const { before, after } = extractContext(fullText, textFrom, textTo);

		// For suffix: wrongForm is at the end of match[0], so matchOffset = match length - wrongForm length.
		// For prefix/substring/whole_word: wrongForm starts at 0.
		const matchOffset = matchType === "suffix" ? match[0].length - wrongForm.length : 0;

		occurrences.push({
			index,
			originalText: match[0],
			correctForm,
			before,
			after,
			from,
			to,
			selectedCorrectForm: correctForm,
			matchOffset,
		});
		index++;
	}

	return occurrences;
};

/**
 * Builds the full replacement string for an occurrence.
 * For suffix: keep the prefix of the word, replace only the suffix.
 * For prefix: replace only the prefix, keep the rest of the word.
 * For substring/whole_word: replace the whole match.
 */
const buildReplacement = (
	originalText: string,
	correctForm: string,
	matchOffset: number,
	matchType: SpellingMatchType,
	wrongForm: string,
): string => {
	if (matchType === "suffix") {
		// originalText = "духаре", wrongForm = "ре", matchOffset = 6
		// keep "духа" + correctForm "риэ" = "духариэ"
		return originalText.slice(0, matchOffset) + correctForm;
	}
	if (matchType === "prefix") {
		// originalText = "ресан", wrongForm = "ре", matchOffset = 0
		// correctForm "риэ" + "сан" = "риэсан"
		return correctForm + originalText.slice(wrongForm.length);
	}
	return correctForm;
};

export const useSpellingOccurrencesDialog = (editor: Editor | null) => {
	const [dialog, setDialog] = useState<SpellingOccurrencesDialogState>(CLOSED);
	const [deselected, setDeselected] = useState<Set<number>>(new Set());

	const open = (wrongForm: string, matchType: SpellingMatchType, correctForm: string, correctForms: string[]) => {
		if (!editor) return;
		const occurrences = findOccurrences(editor, wrongForm, matchType, correctForm, correctForms);
		setDialog({ isOpen: true, wrongForm, matchType, correctForm, correctForms, occurrences });
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

	const handleSelectCorrectForm = (index: number, correctForm: string) => {
		setDialog(prev => ({
			...prev,
			occurrences: prev.occurrences.map(o =>
				o.index === index ? { ...o, selectedCorrectForm: correctForm } : o,
			),
		}));
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

		const toFix = dialog.occurrences
			.filter(o => !deselected.has(o.index))
			.sort((a, b) => b.from - a.from);

		for (const occ of toFix) {
			const replacement = buildReplacement(
				occ.originalText,
				occ.selectedCorrectForm,
				occ.matchOffset,
				dialog.matchType,
				dialog.wrongForm,
			);
			editor.commands.applySpellingFix(occ.from, occ.to, replacement);
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
		handleSelectCorrectForm,
		handleApply,
	};
};
