"use client";

import {
	useCreateHighlight,
	useDeleteHighlight,
	useHighlights,
	type Highlight,
	type HighlightColor,
} from "@/entities/highlight";
import { useTextSelection } from "@/features/reader-highlight";
import { useRef } from "react";

// Get the [start, end) of needle in haystack (first occurrence)
const findOffset = (haystack: string, needle: string): { start: number; end: number } | null => {
	const idx = haystack.indexOf(needle);
	if (idx === -1) return null;
	return { start: idx, end: idx + needle.length };
};

// Check if two ranges overlap
const overlaps = (a: { start: number; end: number }, b: { start: number; end: number }) =>
	a.start < b.end && b.start < a.end;

export const useReaderHighlights = (textId: string, pageNumber: number, contentRaw: string) => {
	const articleRef = useRef<HTMLDivElement | null>(null);
	const { selection, clearSelection } = useTextSelection(articleRef);

	const { data: highlights = [] } = useHighlights(textId, pageNumber);
	const { mutate: createHighlight } = useCreateHighlight(textId, pageNumber);
	const { mutate: deleteHighlight } = useDeleteHighlight(textId, pageNumber);

	const matchedHighlight: Highlight | null = !selection ? null :
		highlights.find(h =>
			h.selectedText === selection.text ||
			h.selectedText.includes(selection.text) ||
			selection.text.includes(h.selectedText),
		) ?? null;

	const handlePickColor = (color: HighlightColor | string) => {
		if (!selection) return;

		const newOffset = findOffset(contentRaw, selection.text);
		if (!newOffset) {
			createHighlight({ textId, pageNumber, color, startOffset: 0, endOffset: 0, selectedText: selection.text });
			clearSelection();
			return;
		}

		const overlapping = highlights.filter(h => {
			const hOffset = findOffset(contentRaw, h.selectedText);
			return hOffset && overlaps(newOffset, hOffset);
		});

		if (overlapping.length === 0) {
			createHighlight({
				textId, pageNumber, color,
				startOffset: newOffset.start,
				endOffset: newOffset.end,
				selectedText: selection.text,
			});
			clearSelection();
			return;
		}

		for (const existing of overlapping) {
			const hOffset = findOffset(contentRaw, existing.selectedText)!;

			const beforeEnd = Math.min(hOffset.end, newOffset.start);
			const beforeText = beforeEnd > hOffset.start
				? contentRaw.slice(hOffset.start, beforeEnd)
				: null;

			const afterStart = Math.max(hOffset.start, newOffset.end);
			const afterText = afterStart < hOffset.end
				? contentRaw.slice(afterStart, hOffset.end)
				: null;

			deleteHighlight(existing.id);

			if (beforeText?.trim()) {
				createHighlight({
					textId, pageNumber,
					color: existing.color as HighlightColor,
					startOffset: hOffset.start,
					endOffset: beforeEnd,
					selectedText: beforeText,
				});
			}

			if (afterText?.trim()) {
				createHighlight({
					textId, pageNumber,
					color: existing.color as HighlightColor,
					startOffset: afterStart,
					endOffset: hOffset.end,
					selectedText: afterText,
				});
			}
		}

		createHighlight({
			textId, pageNumber, color,
			startOffset: newOffset.start,
			endOffset: newOffset.end,
			selectedText: selection.text,
		});

		clearSelection();
	};

	const handleRemoveHighlight = () => {
		if (!matchedHighlight) return;
		deleteHighlight(matchedHighlight.id);
		clearSelection();
	};

	const handleDismiss = () => {
		clearSelection();
	};

	return {
		articleRef,
		selection,
		highlights,
		matchedHighlight,
		handlePickColor,
		handleRemoveHighlight,
		handleDismiss,
	};
};
