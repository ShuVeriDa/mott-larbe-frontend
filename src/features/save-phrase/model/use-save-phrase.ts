"use client";

import { phrasebookApi, phrasebookKeys } from "@/entities/phrasebook";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSavePhrase = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (phraseId: string) => phrasebookApi.toggleSave(phraseId),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: phrasebookKeys.root });
		},
	});
};
