"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTextPhraseApi } from "../api/admin-text-phrase-api";
import { adminTextPhraseKeys } from "../api/admin-text-phrase-keys";
import type { CreatePhraseWithOccurrenceDto, UpdateTextPhraseDto } from "../api/types";

export const useAdminPagePhrases = (textId: string, pageNumber: number) => {
  return useQuery({
    queryKey: adminTextPhraseKeys.byPage(textId, pageNumber),
    queryFn: () => adminTextPhraseApi.getByPage(textId, pageNumber),
    enabled: Boolean(textId) && pageNumber > 0,
  });
};

export const useCreatePhraseWithOccurrence = (textId: string, pageNumber: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePhraseWithOccurrenceDto) =>
      adminTextPhraseApi.createWithOccurrence(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminTextPhraseKeys.byPage(textId, pageNumber),
      });
    },
  });
};

export const useDeletePhraseOccurrence = (textId: string, pageNumber: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (occurrenceId: string) =>
      adminTextPhraseApi.deleteOccurrence(occurrenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminTextPhraseKeys.byPage(textId, pageNumber),
      });
    },
  });
};

export const useUpdatePhrase = (textId: string, pageNumber: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ phraseId, dto }: { phraseId: string; dto: UpdateTextPhraseDto }) =>
      adminTextPhraseApi.update(phraseId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminTextPhraseKeys.byPage(textId, pageNumber),
      });
    },
  });
};
