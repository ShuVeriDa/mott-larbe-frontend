"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "@/entities/dictionary";
import { wordKeys } from "@/entities/word";

interface RemoveVars {
	dictionaryEntryId: string;
	tokenId?: string;
}

export const useRemoveFromVocabulary = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ dictionaryEntryId }: RemoveVars) =>
			dictionaryApi.remove(dictionaryEntryId),
		onSuccess: (_, variables) => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
			if (variables.tokenId) {
				qc.invalidateQueries({
					queryKey: wordKeys.lookup(variables.tokenId),
				});
			}
		},
	});
};
