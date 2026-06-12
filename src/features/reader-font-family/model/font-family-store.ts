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
	| "mono"
	| "scheherazade"
	| "amiri"
	| "noto-naskh"
	| "lateef"
	| "reem-kufi";

export interface FontFamilyMeta {
	label: string;
	/** Tailwind class OR falsy — use cssValue instead */
	cssClass: string;
	/** Raw font-family CSS value for fonts that can't be a Tailwind class */
	cssValue?: string;
	/** Sample glyph rendered in the dropdown */
	sample: string;
	arabicOnly: boolean;
}

export const FONT_FAMILY_META: Record<ReaderFontFamily, FontFamilyMeta> = {
	sans:           { label: "Inter",             cssClass: "font-sans",                                              sample: "Аа", arabicOnly: false },
	golos:          { label: "Golos Text",        cssClass: "[font-family:var(--font-golos)]",                        sample: "Аа", arabicOnly: false },
	lora:           { label: "Lora",              cssClass: "[font-family:var(--font-lora)]",                         sample: "Аа", arabicOnly: false },
	serif:          { label: "Serif",             cssClass: "font-serif",                                             sample: "Аа", arabicOnly: false },
	merriweather:   { label: "Merriweather",      cssClass: "[font-family:var(--font-merriweather)]",                 sample: "Аа", arabicOnly: false },
	"pt-serif":     { label: "PT Serif",          cssClass: "[font-family:var(--font-pt-serif)]",                     sample: "Аа", arabicOnly: false },
	"source-serif": { label: "Source Serif 4",    cssClass: "[font-family:var(--font-source-serif)]",                 sample: "Аа", arabicOnly: false },
	mono:           { label: "Mono",              cssClass: "font-mono",                                              sample: "Аа", arabicOnly: false },
	scheherazade:   { label: "Scheherazade New",  cssClass: "",  cssValue: "var(--font-scheherazade), serif",          sample: "بسم", arabicOnly: true },
	amiri:          { label: "Amiri",             cssClass: "",  cssValue: "var(--font-amiri), serif",                 sample: "بسم", arabicOnly: true },
	"noto-naskh":   { label: "Noto Naskh Arabic", cssClass: "",  cssValue: "var(--font-noto-naskh), serif",            sample: "بسم", arabicOnly: true },
	lateef:         { label: "Lateef",            cssClass: "",  cssValue: "var(--font-lateef), serif",                sample: "بسم", arabicOnly: true },
	"reem-kufi":    { label: "Reem Kufi",         cssClass: "",  cssValue: "var(--font-reem-kufi), sans-serif",        sample: "بسم", arabicOnly: true },
};

/** Returns the Tailwind class for applying this font to a container (non-Arabic fonts). */
export const FONT_FAMILY_CLASS: Record<ReaderFontFamily, string> = Object.fromEntries(
	Object.entries(FONT_FAMILY_META).map(([k, v]) => [k, v.cssClass]),
) as Record<ReaderFontFamily, string>;

interface FontFamilyState {
	/** Font for Cyrillic/Latin scripts */
	family: ReaderFontFamily;
	/** Font for Arabic script — persisted separately */
	arabicFamily: ReaderFontFamily;
	setFamily: (family: ReaderFontFamily) => void;
	setArabicFamily: (family: ReaderFontFamily) => void;
}

export const useReaderFontFamily = create<FontFamilyState>()(
	persist(
		(set) => ({
			family: "sans",
			arabicFamily: "scheherazade",
			setFamily: (family) => set({ family }),
			setArabicFamily: (arabicFamily) => set({ arabicFamily }),
		}),
		{ name: "reader-font-family" },
	),
);
