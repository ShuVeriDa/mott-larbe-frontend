"use client";
import { type MouseEvent } from 'react';
import type { TextToken } from "@/entities/text";
import type { PopupMode } from "@/entities/settings";
import { extractSentence } from "@/shared/lib/extract-sentence";
import { useWordLookupStore } from "./word-lookup-store";

/**
 * Matches Tailwind `max-md`: viewports narrower than `--breakpoint-md` (768px).
 * Word lookup uses bottom sheet here; sidebar panel exists only ≥768px.
 */
export const SHEET_LAYOUT_MAX_WIDTH_PX = 767;

export const useSelectToken = (contentRaw: string, popupMode: PopupMode = "POPUP") => {
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

		// SIDEBAR mode — always open directly in panel, skip popup
		if (popupMode === "SIDEBAR") {
			openInPanel(token, contextSentence);
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

		// BOTH mode or panel already pinned — go directly to panel
		if (popupMode === "BOTH" && panelPinned) {
			openInPanel(token, contextSentence);
			return;
		}

		// POPUP or BOTH (first click) — show popup
		openInPopup(token, anchor, contextSentence);
	};
};
