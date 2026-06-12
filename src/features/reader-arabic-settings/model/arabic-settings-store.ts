"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ARABIC_FONT_SIZE_STEPS = [16, 18, 20, 22, 24, 26, 28, 32, 36] as const;
export type ArabicFontSize = (typeof ARABIC_FONT_SIZE_STEPS)[number];

interface ArabicSettingsState {
	arabicFontSize: ArabicFontSize;
	setArabicFontSize: (v: ArabicFontSize) => void;
}

export const useReaderArabicSettings = create<ArabicSettingsState>()(
	persist(
		(set) => ({
			arabicFontSize: 22,
			setArabicFontSize: (arabicFontSize) => set({ arabicFontSize }),
		}),
		{ name: "reader-arabic-settings" },
	),
);
