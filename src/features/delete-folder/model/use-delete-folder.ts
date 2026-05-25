"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi, folderKeys } from "@/entities/folder";
import { dictionaryKeys } from "@/entities/dictionary";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useDeleteFolder = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (id: string) => folderApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: folderKeys.root });
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
		onError: toastApiError,
	});
};
