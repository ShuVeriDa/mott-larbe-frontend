"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { phrasebookApi, phrasebookKeys } from "@/entities/phrasebook";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useBulkSavePhrases = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();

	return useMutation({
		mutationFn: async (phraseIds: string[]) => {
			await Promise.all(phraseIds.map((id) => phrasebookApi.toggleSave(id)));
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: phrasebookKeys.root });
		},
		onError: toastApiError,
	});
};
