"use client";

import type { RefObject } from "react";
import type { TextToken } from "@/entities/text";
import { getTokenRangeBounds, useTokenRangeSelectionStore } from "@/shared/lib/token-range-selection";
import type { SelectionState } from "./use-text-selection";

export const useTokenRangeSelection = (
	containerRef: RefObject<HTMLElement | null>,
	tokens: readonly TextToken[],
	contentRaw: string,
) => {
	const isActive = useTokenRangeSelectionStore((s) => s.isActive);
	const anchorPosition = useTokenRangeSelectionStore((s) => s.anchorPosition);
	const focusPosition = useTokenRangeSelectionStore((s) => s.focusPosition);
	const startSelection = useTokenRangeSelectionStore((s) => s.startSelection);
	const extendSelection = useTokenRangeSelectionStore((s) => s.extendSelection);
	const endSelection = useTokenRangeSelectionStore((s) => s.endSelection);

	const bounds = getTokenRangeBounds(anchorPosition, focusPosition);

	const resolveSelectionState = (): SelectionState | null => {
		if (!bounds || !containerRef.current) return null;
		const [start, end] = bounds;
		// Positions are sequential per page, but tokens is not guaranteed sorted —
		// sort a slice by position rather than assuming array index === position.
		const inRange = tokens
			.filter((t) => t.position >= start && t.position <= end)
			.sort((a, b) => a.position - b.position);
		if (!inRange.length) return null;
		const startToken = inRange[0];
		const endToken = inRange[inRange.length - 1];

		const startEl = containerRef.current.querySelector(`[data-token-id="${startToken.id}"]`);
		const endEl = containerRef.current.querySelector(`[data-token-id="${endToken.id}"]`);
		if (!startEl || !endEl) return null;

		const startRect = startEl.getBoundingClientRect();
		const endRect = endEl.getBoundingClientRect();
		const top = Math.min(startRect.top, endRect.top);
		const bottom = Math.max(startRect.bottom, endRect.bottom);
		const left = Math.min(startRect.left, endRect.left);
		const right = Math.max(startRect.right, endRect.right);

		// Build DISPLAY-script text (not a contentRaw/Cyrillic slice). Join each
		// token's displayText (or original if not transliterated) with the
		// display-script gap text between consecutive tokens. Gap substrings are
		// script-identical (punctuation/whitespace), so reading them from
		// contentRaw is safe even though the token bodies themselves may be a
		// different script. This mirrors what window.getSelection().toString()
		// produces on desktop, so every downstream consumer (resolveCyrillicText,
		// highlight/note save, translate popups) works unmodified.
		let text = startToken.displayText ?? startToken.original;
		for (let i = 1; i < inRange.length; i++) {
			const prev = inRange[i - 1];
			const cur = inRange[i];
			text += contentRaw.slice(prev.endOffset, cur.startOffset);
			text += cur.displayText ?? cur.original;
		}
		text = text.trim();
		if (!text) return null;

		return { text, x: left + (right - left) / 2, y: top, bottom };
	};

	return {
		isActive,
		bounds,
		isInRange: (position: number) => !!bounds && position >= bounds[0] && position <= bounds[1],
		startSelection,
		extendSelection,
		endSelection,
		resolveSelectionState,
	};
};
