"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const FONT_SIZE_STEPS = [13, 14, 15, 16, 17, 18, 19, 20, 22] as const;
export type ReaderFontSize = (typeof FONT_SIZE_STEPS)[number];

export const FONT_LINE_HEIGHT: Record<ReaderFontSize, number> = {
	13: 1.75,
	14: 1.78,
	15: 1.80,
	16: 1.82,
	17: 1.85,
	18: 1.87,
	19: 1.90,
	20: 1.92,
	22: 1.95,
};

interface FontSizeState {
	size: ReaderFontSize;
	setSize: (size: ReaderFontSize) => void;
}

export const useReaderFontSize = create<FontSizeState>()(
	persist(
		(set) => ({
			size: 17,
			setSize: (size) => set({ size }),
		}),
		{ name: "reader-font-size" },
	),
);
