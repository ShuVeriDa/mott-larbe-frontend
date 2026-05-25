"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "@/entities/dictionary";
import { wordKeys } from "@/entities/word";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

interface RemoveVars {
	dictionaryEntryId: string;
	tokenId?: string;
}

export const useRemoveFromVocabulary = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
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
		onError: toastApiError,
	});
};
