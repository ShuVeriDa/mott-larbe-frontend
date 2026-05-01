"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "@/shared/api";
import { dictionaryKeys, type DictionaryEntry } from "@/entities/dictionary";
import { wordKeys } from "@/entities/word";

interface AddToVocabularyVars {
	tokenId: string;
	folderId?: string | null;
}

export const useAddToVocabulary = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({
			tokenId,
			folderId,
		}: AddToVocabularyVars): Promise<DictionaryEntry> => {
			const { data } = await http.post<DictionaryEntry>("/dictionary", {
				tokenId,
				folderId: folderId ?? null,
			});
			return data;
		},
		onSuccess: (_, variables) => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
			qc.invalidateQueries({ queryKey: wordKeys.lookup(variables.tokenId) });
		},
	});
};
