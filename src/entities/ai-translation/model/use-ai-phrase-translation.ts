"use client";

import { useMutation } from "@tanstack/react-query";
import { aiTranslationApi } from "../api/ai-translation-api";

export const useAiPhraseTranslation = () =>
  useMutation({
    mutationFn: aiTranslationApi.translatePhrase,
  });
