"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderFontSize = "sm" | "md" | "lg";

export const FONT_SIZE_PX: Record<ReaderFontSize, number> = {
	sm: 14,
	md: 16,
	lg: 18,
};

export const FONT_LINE_HEIGHT: Record<ReaderFontSize, number> = {
	sm: 1.8,
	md: 1.85,
	lg: 1.9,
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
