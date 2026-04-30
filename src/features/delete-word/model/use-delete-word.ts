"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "@/entities/dictionary";

export const useDeleteWord = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => dictionaryApi.remove(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
