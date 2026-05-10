"use client";

import {
	useCreateHighlight,
	useDeleteHighlight,
	useHighlights,
	useUpdateHighlight,
	type Highlight,
	type HighlightColor,
} from "@/entities/highlight";
import { useTextSelection } from "@/features/reader-highlight";
import { useCallback, useMemo, useRef } from "react";

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
	const { mutate: updateHighlight } = useUpdateHighlight(textId, pageNumber);
	const { mutate: deleteHighlight } = useDeleteHighlight(textId, pageNumber);

	// Find existing highlight that exactly matches or fully contains the current selection
	const matchedHighlight = useMemo<Highlight | null>(() => {
		if (!selection) return null;
		return (
			highlights.find(h =>
				h.selectedText === selection.text ||
				h.selectedText.includes(selection.text) ||
				selection.text.includes(h.selectedText),
			) ?? null
		);
	}, [selection, highlights]);

	const handlePickColor = useCallback(
		(color: HighlightColor) => {
			if (!selection) return;

			const newOffset = findOffset(contentRaw, selection.text);
			if (!newOffset) {
				// text not found in contentRaw — just create without overlap handling
				createHighlight({ textId, pageNumber, color, startOffset: 0, endOffset: 0, selectedText: selection.text });
				clearSelection();
				return;
			}

			// Find all highlights that overlap with the new selection range
			const overlapping = highlights.filter(h => {
				const hOffset = findOffset(contentRaw, h.selectedText);
				return hOffset && overlaps(newOffset, hOffset);
			});

			if (overlapping.length === 0) {
				// No overlaps — simple create
				createHighlight({
					textId, pageNumber, color,
					startOffset: newOffset.start,
					endOffset: newOffset.end,
					selectedText: selection.text,
				});
				clearSelection();
				return;
			}

			// Handle overlaps: trim/split existing highlights, then create new one
			for (const existing of overlapping) {
				const hOffset = findOffset(contentRaw, existing.selectedText)!;

				// Part of existing BEFORE the new selection
				const beforeEnd = Math.min(hOffset.end, newOffset.start);
				const beforeText = beforeEnd > hOffset.start
					? contentRaw.slice(hOffset.start, beforeEnd)
					: null;

				// Part of existing AFTER the new selection
				const afterStart = Math.max(hOffset.start, newOffset.end);
				const afterText = afterStart < hOffset.end
					? contentRaw.slice(afterStart, hOffset.end)
					: null;

				// Delete the existing highlight
				deleteHighlight(existing.id);

				// Re-create the non-overlapping before part
				if (beforeText?.trim()) {
					createHighlight({
						textId, pageNumber,
						color: existing.color as HighlightColor,
						startOffset: hOffset.start,
						endOffset: beforeEnd,
						selectedText: beforeText,
					});
				}

				// Re-create the non-overlapping after part
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

			// Create the new highlight
			createHighlight({
				textId, pageNumber, color,
				startOffset: newOffset.start,
				endOffset: newOffset.end,
				selectedText: selection.text,
			});

			clearSelection();
		},
		[selection, contentRaw, highlights, textId, pageNumber, createHighlight, deleteHighlight, clearSelection],
	);

	const handleRemoveHighlight = useCallback(() => {
		if (!matchedHighlight) return;
		deleteHighlight(matchedHighlight.id);
		clearSelection();
	}, [matchedHighlight, deleteHighlight, clearSelection]);

	const handleDismiss = useCallback(() => {
		clearSelection();
	}, [clearSelection]);

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
