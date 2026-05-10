"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderColumnWidth = "xs" | "sm" | "md" | "lg" | "full";
export type ReaderPagePadding = "compact" | "normal" | "wide";
export type ReaderLineHeight = "compact" | "normal" | "relaxed";
export type ReaderLetterSpacing = "tight" | "normal" | "wide";

export const COLUMN_WIDTH_PX: Record<ReaderColumnWidth, string> = {
	xs: "480px",
	sm: "600px",
	md: "720px",
	lg: "860px",
	full: "100%",
};

export const PAGE_PADDING_CLASS: Record<ReaderPagePadding, string> = {
	compact: "px-4 max-md:px-2",
	normal: "px-12 max-md:px-4",
	wide: "px-20 max-md:px-6",
};

export const LINE_HEIGHT_VALUE: Record<ReaderLineHeight, number> = {
	compact: 1.6,
	normal: 1.85,
	relaxed: 2.1,
};

export const LETTER_SPACING_VALUE: Record<ReaderLetterSpacing, string> = {
	tight: "-0.01em",
	normal: "0.01em",
	wide: "0.04em",
};

interface TextLayoutState {
	columnWidth: ReaderColumnWidth;
	pagePadding: ReaderPagePadding;
	lineHeight: ReaderLineHeight;
	letterSpacing: ReaderLetterSpacing;
	setColumnWidth: (v: ReaderColumnWidth) => void;
	setPagePadding: (v: ReaderPagePadding) => void;
	setLineHeight: (v: ReaderLineHeight) => void;
	setLetterSpacing: (v: ReaderLetterSpacing) => void;
}

export const useReaderTextLayout = create<TextLayoutState>()(
	persist(
		(set) => ({
			columnWidth: "md",
			pagePadding: "normal",
			lineHeight: "normal",
			letterSpacing: "normal",
			setColumnWidth: (columnWidth) => set({ columnWidth }),
			setPagePadding: (pagePadding) => set({ pagePadding }),
			setLineHeight: (lineHeight) => set({ lineHeight }),
			setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
		}),
		{ name: "reader-text-layout" },
	),
);
