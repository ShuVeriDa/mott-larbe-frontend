"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi, folderKeys, type CreateFolderDto } from "@/entities/folder";
import { dictionaryKeys } from "@/entities/dictionary";

export const useCreateFolder = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: CreateFolderDto) => folderApi.create(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: folderKeys.root });
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
