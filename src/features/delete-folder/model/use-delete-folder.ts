"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { folderApi, folderKeys } from "@/entities/folder";
import { dictionaryKeys } from "@/entities/dictionary";

export const useDeleteFolder = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => folderApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: folderKeys.root });
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
