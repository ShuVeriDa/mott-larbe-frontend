"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import { phrasebookApi, phrasebookKeys } from "../api";
import type { PhrasesQuery } from "../api";

const PAGE_SIZE = 30;

export const usePhrases = (query: Omit<PhrasesQuery, "page" | "limit">) => {
	const debouncedSearch = useDebounce(query.search ?? "", 300);
	const normalizedQuery = { ...query, search: debouncedSearch || undefined };

	return useInfiniteQuery({
		queryKey: phrasebookKeys.phrases(normalizedQuery),
		queryFn: ({ pageParam }) =>
			phrasebookApi.phrases({ ...normalizedQuery, page: pageParam, limit: PAGE_SIZE }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			const fetched = (lastPage.page - 1) * lastPage.limit + lastPage.items.length;
			return fetched < lastPage.total ? lastPage.page + 1 : undefined;
		},
		staleTime: 2 * 60 * 1000,
	});
};
