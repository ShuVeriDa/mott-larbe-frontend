"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { spellingDictionaryApi } from "../api/spelling-dictionary-api";
import { spellingDictionaryKeys } from "../api/spelling-dictionary-keys";
import type { FixOccurrencesResult } from "../api/types";

const CHUNK_SIZE = 100;

const chunk = <T,>(items: T[], size: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < items.length; i += size) {
		chunks.push(items.slice(i, i + size));
	}
	return chunks;
};

export const useFixOccurrences = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (updates: { tokenId: string; original: string }[]) => {
			const result: FixOccurrencesResult = { updated: [], errors: [] };
			for (const batch of chunk(updates, CHUNK_SIZE)) {
				const batchResult = await spellingDictionaryApi.fixOccurrences({ updates: batch });
				result.updated.push(...batchResult.updated);
				result.errors.push(...batchResult.errors);
			}
			return result;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: spellingDictionaryKeys.adminRoot });
		},
	});
};
