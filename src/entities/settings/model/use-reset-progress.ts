"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryKeys } from "@/entities/dictionary";
import { settingsApi } from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useResetProgress = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: () => settingsApi.resetProgress(),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
		onError: toastApiError,
	});
};
