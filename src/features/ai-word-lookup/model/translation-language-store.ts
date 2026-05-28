"use client";

import type { TranslationLanguage } from "@/entities/ai-translation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TranslationLanguageStore {
  targetLanguage: TranslationLanguage;
  setTargetLanguage: (lang: TranslationLanguage) => void;
}

export const useTranslationLanguageStore = create<TranslationLanguageStore>()(
  persist(
    (set) => ({
      targetLanguage: "ru",
      setTargetLanguage: (lang) => set({ targetLanguage: lang }),
    }),
    { name: "ai-translation-language" },
  ),
);
