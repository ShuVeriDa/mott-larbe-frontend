"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HighlightColor = "yellow" | "green" | "blue" | "pink";

export interface TextHighlight {
	id: string;
	textId: string;
	pageNumber: number;
	startOffset: number;
	endOffset: number;
	selectedText: string;
	color: HighlightColor;
	createdAt: string;
	updatedAt: string;
}

export const HIGHLIGHT_COLOR_HEX: Record<HighlightColor, string> = {
	yellow: "#fef08a",
	green: "#bbf7d0",
	blue: "#bfdbfe",
	pink: "#fbcfe8",
};

export const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
	yellow: "bg-yellow-200/70 dark:bg-yellow-400/30",
	green: "bg-green-200/70 dark:bg-green-400/30",
	blue: "bg-blue-200/70 dark:bg-blue-400/30",
	pink: "bg-pink-200/70 dark:bg-pink-400/30",
};

interface HighlightVisibilityState {
	highlightsVisible: boolean;
	setHighlightsVisible: (v: boolean) => void;
}

export const useHighlightVisibility = create<HighlightVisibilityState>()(
	persist(
		(set) => ({
			highlightsVisible: true,
			setHighlightsVisible: (highlightsVisible) => set({ highlightsVisible }),
		}),
		{ name: "reader-highlights-visible" },
	),
);
