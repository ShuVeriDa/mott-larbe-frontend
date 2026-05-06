"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	dictionaryApi,
	dictionaryKeys,
	type DictionaryEntry,
	type DictionaryListQuery,
	type DictionaryListResponse,
	type DictionaryStats,
	type UpdateDictionaryEntryDto,
} from "@/entities/dictionary";
import type { LearningLevel } from "@/shared/types";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";

export interface UpdateWordVars {
	id: string;
	body: UpdateDictionaryEntryDto;
	previousLevel?: LearningLevel;
}

export const useUpdateWord = () => {
	const qc = useQueryClient();
	const { t } = useI18n();
	const { error: toastError } = useToast();

	return useMutation({
		mutationFn: ({ id, body }: UpdateWordVars) =>
			dictionaryApi.update(id, body),
		onMutate: async ({ id, body, previousLevel }) => {
			await qc.cancelQueries({ queryKey: dictionaryKeys.root });

			const previousLists = qc.getQueriesData<DictionaryListResponse>({
				queryKey: ["dictionary", "list"],
			});
			const previousStats = qc.getQueryData<DictionaryStats>(
				dictionaryKeys.stats(),
			);

			if (body.learningLevel && previousLevel) {
				const newLevel = body.learningLevel;

				let entrySnapshot: DictionaryEntry | undefined;
				for (const [, data] of previousLists) {
					const found = data?.items.find((e) => e.id === id);
					if (found) {
						entrySnapshot = found;
						break;
					}
				}

				if (entrySnapshot) {
					const updatedEntry: DictionaryEntry = {
						...entrySnapshot,
						learningLevel: newLevel,
						wordProgressStatus: newLevel,
					};

					for (const [key, data] of previousLists) {
						if (!data) continue;
						const queryObj = (key as unknown[])[2] as
							| DictionaryListQuery
							| undefined;
						const queryStatus = queryObj?.status;

						if (queryStatus === previousLevel) {
							qc.setQueryData<DictionaryListResponse>(key, {
								...data,
								items: data.items.filter((e) => e.id !== id),
								total: Math.max(0, data.total - 1),
							});
						} else if (queryStatus === newLevel) {
							qc.setQueryData<DictionaryListResponse>(key, {
								...data,
								items: [updatedEntry, ...data.items],
								total: data.total + 1,
							});
						}
					}

					if (previousStats) {
						qc.setQueryData<DictionaryStats>(dictionaryKeys.stats(), {
							...previousStats,
							byLevel: {
								...previousStats.byLevel,
								[previousLevel]: Math.max(
									0,
									previousStats.byLevel[previousLevel] - 1,
								),
								[newLevel]: previousStats.byLevel[newLevel] + 1,
							},
						});
					}
				}
			} else {
				qc.setQueriesData<DictionaryListResponse>(
					{ queryKey: ["dictionary", "list"] },
					(old) => {
						if (!old) return old;
						return {
							...old,
							items: old.items.map((item) =>
								item.id === id
									? {
											...item,
											...(body.folderId !== undefined
												? { folderId: body.folderId, folder: null }
												: {}),
										}
									: item,
							),
						};
					},
				);
			}

			return { previousLists, previousStats };
		},
		onError: (_err, _vars, context) => {
			if (context) {
				for (const [key, data] of context.previousLists) {
					qc.setQueryData(key, data);
				}
				if (context.previousStats) {
					qc.setQueryData(dictionaryKeys.stats(), context.previousStats);
				}
			}
			toastError(t("vocabulary.errorLoading"));
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: dictionaryKeys.root });
		},
	});
};
