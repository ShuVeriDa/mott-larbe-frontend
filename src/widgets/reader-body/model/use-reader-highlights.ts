"use client";

import {
	useCreateHighlight,
	useDeleteHighlight,
	useHighlights,
	type Highlight,
	type HighlightColor,
} from "@/entities/highlight";
import { resolveCyrillicText, type TextToken } from "@/entities/text";
import { useTextSelection, useTokenRangeSelection } from "@/features/reader-highlight";
import { useEffect, useRef } from "react";

// Get the [start, end) of needle in haystack (first occurrence)
const findOffset = (haystack: string, needle: string): { start: number; end: number } | null => {
	const idx = haystack.indexOf(needle);
	if (idx === -1) return null;
	return { start: idx, end: idx + needle.length };
};

// Check if two ranges overlap
const overlaps = (a: { start: number; end: number }, b: { start: number; end: number }) =>
	a.start < b.end && b.start < a.end;

export const useReaderHighlights = (
	textId: string,
	pageNumber: number,
	contentRaw: string,
	displayTokens?: readonly TextToken[],
	isNonCyrillic?: boolean,
) => {
	const articleRef = useRef<HTMLDivElement>(null);
	const { selection: nativeSelection, clearSelection: clearNativeSelection } = useTextSelection(articleRef);
	const tokenRange = useTokenRangeSelection(articleRef, displayTokens ?? [], contentRaw);
	const { isActive: isRangeSelectionActive, resolveSelectionState, endSelection: endRangeSelection } = tokenRange;

	// Touch-mode selection takes priority outright when active — it must NOT
	// merge with (or defer to) native selection. Touch browsers can synthesize
	// mouse events after a touch gesture, so a stray native Selection can exist
	// even while range-selection mode is active; trusting native selection as
	// a fallback here would resurface the native action-bar problem this
	// feature exists to avoid. Native `selection` only matters when touch-range
	// mode is not active (desktop, or touch before any long-press has started).
	const selection = isRangeSelectionActive ? resolveSelectionState() : nativeSelection;

	const clearSelection = () => {
		clearNativeSelection();
		endRangeSelection();
	};

	// The token-range-selection store is a page-agnostic singleton — reset it
	// whenever the page identity changes (swipe navigation) or this hook
	// unmounts, so a selection started on one page can never silently swallow
	// the first tap on a different page.
	useEffect(() => {
		return () => endRangeSelection();
	}, [textId, pageNumber, endRangeSelection]);

	const { data: highlights = [] } = useHighlights(textId, pageNumber);
	const { mutate: createHighlight } = useCreateHighlight(textId, pageNumber);
	const { mutate: deleteHighlight } = useDeleteHighlight(textId, pageNumber);

	const resolveText = (displayText: string): string => {
		if (!isNonCyrillic || !displayTokens) return displayText;
		return resolveCyrillicText(displayText, displayTokens, contentRaw);
	};

	const matchedHighlight: Highlight | null = !selection ? null :
		highlights.find(h => {
			const cyrText = resolveText(selection.text);
			return (
				h.selectedText === cyrText ||
				h.selectedText.includes(cyrText) ||
				cyrText.includes(h.selectedText)
			);
		}) ?? null;

	const handlePickColor = (color: HighlightColor | string) => {
		if (!selection) return;
		if (selection.text.length > 2_000) return;

		const cyrillicText = resolveText(selection.text);
		const newOffset = findOffset(contentRaw, cyrillicText);
		if (!newOffset) {
			createHighlight({ textId, pageNumber, color, startOffset: 0, endOffset: 0, selectedText: cyrillicText });
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
				selectedText: cyrillicText,
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
			selectedText: cyrillicText,
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

	const handleTokenLongPress = (token: TextToken) => tokenRange.startSelection(token.position);
	const handleTokenRangeTap = (token: TextToken) => tokenRange.extendSelection(token.position);

	return {
		articleRef,
		selection,
		highlights,
		matchedHighlight,
		handlePickColor,
		handleRemoveHighlight,
		handleDismiss,
		isTokenInRange: tokenRange.isInRange,
		onTokenLongPress: handleTokenLongPress,
		onTokenRangeTap: handleTokenRangeTap,
	};
};
