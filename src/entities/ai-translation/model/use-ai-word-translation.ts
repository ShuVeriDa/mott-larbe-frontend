"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aiTranslationApi } from "../api/ai-translation-api";
import { aiTranslationKeys } from "../api/ai-translation-keys";

export const useAiWordTranslation = () => {
  const queryClient = useQueryClient();

  const translate = useMutation({
    mutationFn: aiTranslationApi.translateWord,
  });

  const vote = useMutation({
    mutationFn: ({ cacheId, vote }: { cacheId: string; vote: "up" | "down" }) =>
      aiTranslationApi.vote(cacheId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aiTranslationKeys.root });
    },
  });

  return { translate, vote };
};
