"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import { libraryTextApi, libraryTextKeys } from "../api";
import type { GetLibraryTextsQuery } from "../api";

export const useLibraryTexts = (query: GetLibraryTextsQuery) => {
	const debouncedSearch = useDebounce(query.search ?? "", 300);

	const normalizedQuery: GetLibraryTextsQuery = {
		...query,
		search: debouncedSearch || undefined,
	};

	return useQuery({
		queryKey: libraryTextKeys.list(normalizedQuery),
		queryFn: () => libraryTextApi.list(normalizedQuery),
		staleTime: 60_000,
	});
};
