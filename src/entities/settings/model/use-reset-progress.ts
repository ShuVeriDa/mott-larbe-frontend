"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryKeys } from "@/entities/dictionary";
import { settingsApi } from "../api";

export const useResetProgress = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => settingsApi.resetProgress(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
