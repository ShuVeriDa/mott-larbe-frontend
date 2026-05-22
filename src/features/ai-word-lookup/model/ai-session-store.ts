"use client";

import { create } from "zustand";
import type { AiWordTranslation } from "@/entities/ai-translation";

export interface AiSessionEntry {
  word: string;
  translation: AiWordTranslation;
  refinedTranslation?: string;
  addedToDict: boolean;
}

interface AiSessionStore {
  entries: AiSessionEntry[];
  add: (word: string, translation: AiWordTranslation) => void;
  addRefinement: (word: string, refinedTranslation: string) => void;
  markAddedToDict: (word: string) => void;
  clear: () => void;
}

export const useAiSessionStore = create<AiSessionStore>((set) => ({
  entries: [],
  add: (word, translation) =>
    set((state) => {
      const exists = state.entries.some((e) => e.word === word);
      if (exists) return state;
      return { entries: [...state.entries, { word, translation, addedToDict: false }] };
    }),
  addRefinement: (word, refinedTranslation) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.word === word ? { ...e, refinedTranslation } : e,
      ),
    })),
  markAddedToDict: (word) =>
    set((state) => ({
      entries: state.entries.map((e) =>
        e.word === word ? { ...e, addedToDict: true } : e,
      ),
    })),
  clear: () => set({ entries: [] }),
}));
