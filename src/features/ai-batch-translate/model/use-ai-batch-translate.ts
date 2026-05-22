"use client";

import { aiTranslationApi } from "@/entities/ai-translation";
import type { TextToken } from "@/entities/text";
import { useAiSessionStore } from "@/features/ai-word-lookup";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { useState } from "react";

export type AiBatchTranslateState = "idle" | "loading" | "done" | "error";

export const useAiBatchTranslate = (tokens: TextToken[]) => {
  const [state, setState] = useState<AiBatchTranslateState>("idle");
  const addToSession = useAiSessionStore((s) => s.add);
  const { error: toastError } = useToast();
  const { t } = useI18n();

  const translate = async () => {
    if (state === "loading") return;

    const unknownWords = [
      ...new Set(
        tokens
          .filter(t => !t.isKnown && t.normalized.length > 1)
          .map(t => t.normalized)
          .filter(Boolean),
      ),
    ].slice(0, 50);

    if (unknownWords.length === 0) {
      setState("done");
      return;
    }

    setState("loading");
    try {
      const result = await aiTranslationApi.batchTranslate(unknownWords);
      for (const [word, translation] of Object.entries(result)) {
        addToSession(word, {
          id: "",
          lemma: word,
          contextSentence: null,
          cacheType: "WORD_ONLY",
          translation,
          transliteration: null,
          partOfSpeech: null,
          example: null,
          source: "gemini",
          status: "PENDING",
          requestCount: 1,
          thumbsUp: 0,
          thumbsDown: 0,
          fromCache: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      setState("done");
    } catch {
      setState("error");
      toastError(t("ai.phrase.batchError"));
    }
  };

  return { state, translate };
};
