"use client";

import { useQuery } from "@tanstack/react-query";
import { aiTranslationApi } from "../api/ai-translation-api";
import { aiTranslationKeys } from "../api/ai-translation-keys";

export const useGeminiKeyStatus = () =>
  useQuery({
    queryKey: aiTranslationKeys.keyStatus(),
    queryFn: aiTranslationApi.getKeyStatus,
    staleTime: 60_000,
  });
