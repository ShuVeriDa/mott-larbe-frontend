"use client";
import { type MouseEvent } from 'react';
import type { TextToken } from "@/entities/text";
import { extractSentence } from "@/shared/lib/extract-sentence";
import { useWordLookupStore } from "./word-lookup-store";

/**
 * Matches Tailwind `max-md`: viewports narrower than `--breakpoint-md` (768px).
 * Word lookup uses bottom sheet here; sidebar panel exists only ≥768px.
 */
export const SHEET_LAYOUT_MAX_WIDTH_PX = 767;

export const useSelectToken = (contentRaw: string) => {
	const openInPopup = useWordLookupStore((s) => s.openInPopup);
	const openInPanel = useWordLookupStore((s) => s.openInPanel);
	const openInSheet = useWordLookupStore((s) => s.openInSheet);
	const panelPinned = useWordLookupStore((s) => s.panelPinned);

	return (token: TextToken, event: MouseEvent<HTMLSpanElement>) => {
		const contextSentence = extractSentence(contentRaw, token.startOffset, token.endOffset);

		const useSheetLayout =
			typeof window !== "undefined" &&
			window.innerWidth <= SHEET_LAYOUT_MAX_WIDTH_PX;

		if (useSheetLayout) {
			openInSheet(token, contextSentence);
			return;
		}

		const target = event.currentTarget;
		const rect = target.getBoundingClientRect();
		const anchor = {
			left: rect.left,
			top: rect.top,
			width: rect.width,
			height: rect.height,
		};

		if (panelPinned) {
			openInPanel(token, contextSentence);
			return;
		}

		openInPopup(token, anchor, contextSentence);
	};
};
