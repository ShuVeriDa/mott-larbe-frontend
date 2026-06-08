"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "@/entities/dictionary";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import type { PhraseWord } from "@/entities/phrasebook";

export const useAddPhraseWords = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();

	return useMutation({
		mutationFn: async (words: PhraseWord[]) => {
			await Promise.all(
				words.map((word) =>
					dictionaryApi.create({ word: word.original, translation: word.translation }),
				),
			);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
		onError: toastApiError,
	});
};
