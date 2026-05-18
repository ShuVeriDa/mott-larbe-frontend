"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HighlightColor =
	| "yellow"
	| "green"
	| "blue"
	| "pink"
	| "orange"
	| "purple"
	| "teal"
	| "red";

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
	orange: "#fed7aa",
	purple: "#e9d5ff",
	teal: "#99f6e4",
	red: "#fecaca",
};

export const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
	yellow: "bg-yellow-200/70 dark:bg-yellow-400/30",
	green: "bg-green-200/70 dark:bg-green-400/30",
	blue: "bg-blue-200/70 dark:bg-blue-400/30",
	pink: "bg-pink-200/70 dark:bg-pink-400/30",
	orange: "bg-orange-200/70 dark:bg-orange-400/30",
	purple: "bg-purple-200/70 dark:bg-purple-400/30",
	teal: "bg-teal-200/70 dark:bg-teal-400/30",
	red: "bg-red-200/70 dark:bg-red-400/30",
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

interface PhraseColorVisibilityState {
	phraseColorVisible: boolean;
	setPhraseColorVisible: (v: boolean) => void;
}

export const usePhraseColorVisibility = create<PhraseColorVisibilityState>()(
	persist(
		(set) => ({
			phraseColorVisible: true,
			setPhraseColorVisible: (phraseColorVisible) => set({ phraseColorVisible }),
		}),
		{ name: "reader-phrase-color-visible" },
	),
);
