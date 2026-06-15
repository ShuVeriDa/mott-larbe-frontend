"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	dictionaryApi,
	dictionaryKeys,
	type DictionaryListResponse,
	type DictionaryStats,
} from "@/entities/dictionary";
import type { LearningLevel } from "@/shared/types";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useDeleteWord = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();

	return useMutation({
		mutationFn: (id: string) => dictionaryApi.remove(id),
		onMutate: async (id) => {
			await qc.cancelQueries({ queryKey: dictionaryKeys.root });

			const previousLists = qc.getQueriesData<DictionaryListResponse>({
				queryKey: dictionaryKeys.listPrefix,
			});
			const previousStats = qc.getQueryData<DictionaryStats>(
				dictionaryKeys.stats(),
			);

			let entryLevel: LearningLevel | undefined;
			for (const [, data] of previousLists) {
				const found = data?.items.find((e) => e.id === id);
				if (found) {
					entryLevel = found.learningLevel;
					break;
				}
			}

			qc.setQueriesData<DictionaryListResponse>(
				{ queryKey: dictionaryKeys.listPrefix },
				(old) => {
					if (!old) return old;
					const filtered = old.items.filter((item) => item.id !== id);
					const removed = old.items.length - filtered.length;
					return {
						...old,
						items: filtered,
						total: Math.max(0, old.total - removed),
					};
				},
			);

			if (previousStats && entryLevel) {
				qc.setQueryData<DictionaryStats>(dictionaryKeys.stats(), {
					...previousStats,
					total: Math.max(0, previousStats.total - 1),
					byLevel: {
						...previousStats.byLevel,
						[entryLevel]: Math.max(
							0,
							previousStats.byLevel[entryLevel] - 1,
						),
					},
				});
			}

			return { previousLists, previousStats };
		},
		onError: (err, _id, context) => {
			if (context) {
				for (const [key, data] of context.previousLists) {
					qc.setQueryData(key, data);
				}
				if (context.previousStats) {
					qc.setQueryData(dictionaryKeys.stats(), context.previousStats);
				}
			}
			toastApiError(err);
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
