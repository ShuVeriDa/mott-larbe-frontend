"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryKeys } from "@/entities/dictionary";
import { settingsApi } from "../api";

export const useClearVocabulary = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => settingsApi.clearVocabulary(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
