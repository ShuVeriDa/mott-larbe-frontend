"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { spellingDictionaryApi } from "../api/spelling-dictionary-api";
import { spellingDictionaryKeys } from "../api/spelling-dictionary-keys";
import type { FetchSpellingEntriesParams } from "../api/types";
import { adminSpellingDictionaryQueryOptions } from "./queries";

export const useAdminSpellingDictionary = (params: FetchSpellingEntriesParams) =>
	useQuery(adminSpellingDictionaryQueryOptions(params));

const useInvalidateAll = () => {
	const queryClient = useQueryClient();
	return () => {
		queryClient.invalidateQueries({ queryKey: spellingDictionaryKeys.root });
		queryClient.invalidateQueries({ queryKey: spellingDictionaryKeys.adminRoot });
	};
};

export const useCreateSpellingEntry = () => {
	const invalidate = useInvalidateAll();
	return useMutation({
		mutationFn: spellingDictionaryApi.create,
		onSuccess: invalidate,
	});
};

export const useUpdateSpellingEntry = () => {
	const invalidate = useInvalidateAll();
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof spellingDictionaryApi.update>[1] }) =>
			spellingDictionaryApi.update(id, payload),
		onSuccess: invalidate,
	});
};

export const useDeleteSpellingEntry = () => {
	const invalidate = useInvalidateAll();
	return useMutation({
		mutationFn: spellingDictionaryApi.delete,
		onSuccess: invalidate,
	});
};
