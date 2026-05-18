"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderColumnWidth = "xs" | "sm" | "md" | "lg" | "full";
export type ReaderPagePadding = "compact" | "normal" | "wide";
export type ReaderLineHeight = "compact" | "normal" | "relaxed";
export type ReaderLetterSpacing = "tight" | "normal" | "wide";
export type ReaderParagraphSpacing = "none" | "compact" | "normal" | "relaxed";

// Column width in ch units — scales proportionally with font size and screen
export const COLUMN_WIDTH_PX: Record<ReaderColumnWidth, string> = {
	xs: "min(55ch, 100%)",
	sm: "min(66ch, 100%)",
	md: "min(76ch, 100%)",
	lg: "min(90ch, 100%)",
	full: "100%",
};

// Page padding as responsive tailwind classes with vw-based fallback for mobile
export const PAGE_PADDING_CLASS: Record<ReaderPagePadding, string> = {
	compact: "px-[4vw] sm:px-[3vw] lg:px-[2vw]",
	normal: "px-[8vw] sm:px-[6vw] lg:px-[4vw]",
	wide: "px-[14vw] sm:px-[10vw] lg:px-[6vw]",
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

export const PARAGRAPH_SPACING_VALUE: Record<ReaderParagraphSpacing, string> = {
	none: "0px",
	compact: "0.5rem",
	normal: "1.25rem",
	relaxed: "2.5rem",
};

interface TextLayoutState {
	columnWidth: ReaderColumnWidth;
	pagePadding: ReaderPagePadding;
	lineHeight: ReaderLineHeight;
	letterSpacing: ReaderLetterSpacing;
	paragraphSpacing: ReaderParagraphSpacing;
	setColumnWidth: (v: ReaderColumnWidth) => void;
	setPagePadding: (v: ReaderPagePadding) => void;
	setLineHeight: (v: ReaderLineHeight) => void;
	setLetterSpacing: (v: ReaderLetterSpacing) => void;
	setParagraphSpacing: (v: ReaderParagraphSpacing) => void;
}

export const useReaderTextLayout = create<TextLayoutState>()(
	persist(
		(set) => ({
			columnWidth: "md",
			pagePadding: "normal",
			lineHeight: "normal",
			letterSpacing: "normal",
			paragraphSpacing: "normal",
			setColumnWidth: (columnWidth) => set({ columnWidth }),
			setPagePadding: (pagePadding) => set({ pagePadding }),
			setLineHeight: (lineHeight) => set({ lineHeight }),
			setLetterSpacing: (letterSpacing) => set({ letterSpacing }),
			setParagraphSpacing: (paragraphSpacing) => set({ paragraphSpacing }),
		}),
		{ name: "reader-text-layout" },
	),
);
