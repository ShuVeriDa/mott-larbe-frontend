"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "@/entities/dictionary";
import { wordKeys } from "@/entities/word";

interface AssignFolderVars {
	dictionaryEntryId: string;
	folderId: string | null;
	tokenId?: string;
}

export const useAssignFolder = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ dictionaryEntryId, folderId }: AssignFolderVars) =>
			dictionaryApi.update(dictionaryEntryId, { folderId }),
		onSuccess: (_, variables) => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
			if (variables.tokenId) {
				qc.invalidateQueries({ queryKey: wordKeys.lookup(variables.tokenId) });
			}
		},
	});
};
