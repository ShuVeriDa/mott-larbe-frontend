"use client";

import { aiTranslationApi } from "@/entities/ai-translation";
import type { AiPhraseTranslation, TranslationLanguage } from "@/entities/ai-translation";
import { useState } from "react";
import { useAiSessionStore } from "./ai-session-store";

export type AiWordRefineState =
  | { phase: "idle" }
  | { phase: "open" }
  | { phase: "loading" }
  | { phase: "done"; result: AiPhraseTranslation }
  | { phase: "error" };

export const useAiWordRefine = () => {
  const [refineState, setRefineState] = useState<AiWordRefineState>({ phase: "idle" });
  const addRefinement = useAiSessionStore((s) => s.addRefinement);

  const openRefine = () => setRefineState({ phase: "open" });
  const closeRefine = () => setRefineState({ phase: "idle" });
  const resetRefine = () => setRefineState({ phase: "idle" });

  const refine = async (
    word: string,
    previousTranslation: string,
    hint: string,
    contextSentence?: string,
    targetLanguage?: TranslationLanguage,
  ) => {
    setRefineState({ phase: "loading" });
    try {
      const result = await aiTranslationApi.refinePhrase({
        phrase: word,
        previousTranslation,
        hint,
        targetLanguage,
      });
      setRefineState({ phase: "done", result });
      addRefinement(word, result.translation);
      aiTranslationApi
        .saveRefinement({ word, translation: result.translation, contextSentence, targetLanguage })
        .catch(() => {});
    } catch {
      setRefineState({ phase: "error" });
    }
  };

  return { refineState, openRefine, closeRefine, resetRefine, refine };
};
