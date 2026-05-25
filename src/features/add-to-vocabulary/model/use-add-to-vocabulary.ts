"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api";
import { dictionaryKeys, type DictionaryEntry } from "@/entities/dictionary";
import { wordKeys } from "@/entities/word";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

interface AddToVocabularyVars {
	tokenId: string;
	folderId?: string | null;
	word?: string;
	translation?: string;
}

export const useAddToVocabulary = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: async ({
			tokenId,
			folderId,
			word,
			translation,
		}: AddToVocabularyVars): Promise<DictionaryEntry> => {
			const { data } = await http.post<DictionaryEntry>("/dictionary", {
				tokenId,
				folderId: folderId ?? null,
				...(word && { word }),
				...(translation && { translation }),
			});
			return data;
		},
		onSuccess: (_, variables) => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
			qc.invalidateQueries({ queryKey: wordKeys.lookup(variables.tokenId) });
		},
		onError: toastApiError,
	});
};
