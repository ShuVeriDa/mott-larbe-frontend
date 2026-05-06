"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	folderApi,
	folderKeys,
	type Folder,
	type ReorderFoldersDto,
} from "@/entities/folder";

export const useReorderFolders = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: ReorderFoldersDto) => folderApi.reorder(body),
		onMutate: async ({ orderedIds }) => {
			await qc.cancelQueries({ queryKey: folderKeys.list() });
			const prev = qc.getQueryData<Folder[]>(folderKeys.list());
			qc.setQueryData<Folder[]>(folderKeys.list(), (old) => {
				if (!old) return old;
				return orderedIds
					.map((id) => old.find((f) => f.id === id))
					.filter((f): f is Folder => f !== undefined);
			});
			return { prev };
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.prev !== undefined) {
				qc.setQueryData(folderKeys.list(), ctx.prev);
			}
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: folderKeys.list() });
		},
	});
};
