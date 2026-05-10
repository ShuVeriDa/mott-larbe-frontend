"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderFontFamily = "sans" | "serif" | "mono";

export const FONT_FAMILY_CLASS: Record<ReaderFontFamily, string> = {
	sans: "font-sans",
	serif: "font-serif",
	mono: "font-mono",
};

interface FontFamilyState {
	family: ReaderFontFamily;
	setFamily: (family: ReaderFontFamily) => void;
}

export const useReaderFontFamily = create<FontFamilyState>()(
	persist(
		(set) => ({
			family: "sans",
			setFamily: (family) => set({ family }),
		}),
		{ name: "reader-font-family" },
	),
);
