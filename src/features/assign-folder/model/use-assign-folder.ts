"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	folderApi,
	folderKeys,
	type BulkAssignDto,
} from "@/entities/folder";
import { dictionaryKeys } from "@/entities/dictionary";

export const useAssignEntriesToFolder = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: BulkAssignDto) => folderApi.bulkAssignEntries(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: folderKeys.root });
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
