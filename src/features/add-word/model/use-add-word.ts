"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	dictionaryApi,
	dictionaryKeys,
	type CreateDictionaryEntryDto,
} from "@/entities/dictionary";

export const useAddWord = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: CreateDictionaryEntryDto) => dictionaryApi.create(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
