"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	dictionaryApi,
	dictionaryKeys,
	type UpdateDictionaryEntryDto,
} from "@/entities/dictionary";

interface UpdateWordVars {
	id: string;
	body: UpdateDictionaryEntryDto;
}

export const useUpdateWord = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, body }: UpdateWordVars) =>
			dictionaryApi.update(id, body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
