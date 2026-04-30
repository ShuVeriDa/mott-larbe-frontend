"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
	dictionaryApi,
	dictionaryKeys,
	type DictionaryEntry,
	type DictionaryListQuery,
} from "@/entities/dictionary";
import { LEARNING_LEVELS, type LearningLevel } from "@/shared/types";
import { useDebounce } from "@/shared/lib/debounce";
import { useVocabularyFilters } from "@/features/vocabulary-filters";

export interface GroupedSection {
	status: LearningLevel;
	items: DictionaryEntry[];
	total: number;
}

const STATUS_ORDER: LearningLevel[] = ["NEW", "LEARNING", "KNOWN"];

export const useGroupedList = () => {
	const status = useVocabularyFilters((s) => s.status);
	const cefrLevel = useVocabularyFilters((s) => s.cefrLevel);
	const sort = useVocabularyFilters((s) => s.sort);
	const folderId = useVocabularyFilters((s) => s.folderId);
	const rawSearch = useVocabularyFilters((s) => s.search);
	const search = useDebounce(rawSearch, 300);

	const baseQuery: DictionaryListQuery = useMemo(
		() => ({
			cefrLevel: cefrLevel ?? undefined,
			folderId: folderId ?? undefined,
			sort,
			search: search.trim() ? search.trim() : undefined,
			limit: 50,
		}),
		[cefrLevel, folderId, sort, search],
	);

	const statuses: LearningLevel[] = status ? [status] : [...LEARNING_LEVELS];

	const queries = useQueries({
		queries: statuses.map((s) => {
			const q: DictionaryListQuery = { ...baseQuery, status: s };
			return {
				queryKey: dictionaryKeys.list(q),
				queryFn: () => dictionaryApi.list(q),
			};
		}),
	});

	const isLoading = queries.some((q) => q.isLoading);
	const isError = queries.some((q) => q.isError);

	const sections: GroupedSection[] = STATUS_ORDER.filter((s) =>
		statuses.includes(s),
	).map((s) => {
		const idx = statuses.indexOf(s);
		const data = queries[idx]?.data;
		return {
			status: s,
			items: data?.items ?? [],
			total: data?.total ?? 0,
		};
	});

	return {
		sections,
		isLoading,
		isError,
		isEmpty: !isLoading && sections.every((sec) => sec.items.length === 0),
	};
};
