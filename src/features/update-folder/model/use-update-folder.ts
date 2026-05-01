"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi, folderKeys, type UpdateFolderDto } from "@/entities/folder";
import { dictionaryKeys } from "@/entities/dictionary";

export const useUpdateFolder = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, body }: { id: string; body: UpdateFolderDto }) =>
			folderApi.update(id, body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: folderKeys.root });
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
