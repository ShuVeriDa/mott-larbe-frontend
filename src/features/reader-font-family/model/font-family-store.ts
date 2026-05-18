"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ReaderFontFamily =
	| "sans"
	| "golos"
	| "serif"
	| "lora"
	| "merriweather"
	| "pt-serif"
	| "source-serif"
	| "mono";

export const FONT_FAMILY_CLASS: Record<ReaderFontFamily, string> = {
	sans: "font-sans",
	golos: "[font-family:var(--font-golos)]",
	serif: "font-serif",
	lora: "[font-family:var(--font-lora)]",
	merriweather: "[font-family:var(--font-merriweather)]",
	"pt-serif": "[font-family:var(--font-pt-serif)]",
	"source-serif": "[font-family:var(--font-source-serif)]",
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
