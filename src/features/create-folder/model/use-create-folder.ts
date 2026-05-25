"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi, folderKeys, type CreateFolderDto } from "@/entities/folder";
import { dictionaryKeys } from "@/entities/dictionary";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useCreateFolder = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (body: CreateFolderDto) => folderApi.create(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: folderKeys.root });
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
		onError: toastApiError,
	});
};
