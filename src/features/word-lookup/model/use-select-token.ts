"use client";
import { type MouseEvent } from 'react';
import type { TextToken } from "@/entities/text";
import { useWordLookupStore } from "./word-lookup-store";

const MOBILE_BREAKPOINT = 640;

export const useSelectToken = () => {
	const openInPopup = useWordLookupStore((s) => s.openInPopup);
	const openInPanel = useWordLookupStore((s) => s.openInPanel);
	const openInSheet = useWordLookupStore((s) => s.openInSheet);
	const panelPinned = useWordLookupStore((s) => s.panelPinned);

	return (token: TextToken, event: MouseEvent<HTMLSpanElement>) => {
		const isMobile =
			typeof window !== "undefined" &&
			window.innerWidth <= MOBILE_BREAKPOINT;

		if (isMobile) {
			openInSheet(token);
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
			openInPanel(token);
			return;
		}

		openInPopup(token, anchor);
	};
};
