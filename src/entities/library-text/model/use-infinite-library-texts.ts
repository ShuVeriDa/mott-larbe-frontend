"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import { libraryTextApi, libraryTextKeys } from "../api";
import type { GetLibraryTextsQuery } from "../api";

const PAGE_SIZE = 20;

export const useInfiniteLibraryTexts = (
	query: Omit<GetLibraryTextsQuery, "page" | "limit">,
) => {
	const debouncedSearch = useDebounce(query.search ?? "", 300);
	const normalizedQuery = {
		...query,
		search: debouncedSearch || undefined,
	};

	return useInfiniteQuery({
		queryKey: libraryTextKeys.infinite(normalizedQuery),
		queryFn: ({ pageParam }) =>
			libraryTextApi.list({
				...normalizedQuery,
				page: pageParam,
				limit: PAGE_SIZE,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.items.length === PAGE_SIZE ? lastPage.page + 1 : undefined,
		staleTime: 60_000,
	});
};
