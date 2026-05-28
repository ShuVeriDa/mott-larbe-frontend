"use client";

import { DEFAULT_GEMINI_MODEL, type GeminiModel } from "@/entities/ai-translation";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GeminiModelStore {
  geminiModel: GeminiModel;
  setGeminiModel: (model: GeminiModel) => void;
}

export const useGeminiModelStore = create<GeminiModelStore>()(
  persist(
    (set) => ({
      geminiModel: DEFAULT_GEMINI_MODEL,
      setGeminiModel: (model) => set({ geminiModel: model }),
    }),
    { name: "ai-gemini-model" },
  ),
);
