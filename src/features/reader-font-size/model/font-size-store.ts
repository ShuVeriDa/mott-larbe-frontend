"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderFontSize = "xs" | "sm" | "md" | "lg" | "xl";

export const FONT_SIZE_PX: Record<ReaderFontSize, number> = {
	xs: 13,
	sm: 15,
	md: 17,
	lg: 19,
	xl: 22,
};

export const FONT_LINE_HEIGHT: Record<ReaderFontSize, number> = {
	xs: 1.75,
	sm: 1.8,
	md: 1.85,
	lg: 1.9,
	xl: 1.95,
};

interface FontSizeState {
	size: ReaderFontSize;
	setSize: (size: ReaderFontSize) => void;
}

export const useReaderFontSize = create<FontSizeState>()(
	persist(
		(set) => ({
			size: "md",
			setSize: (size) => set({ size }),
		}),
		{ name: "reader-font-size" },
	),
);
