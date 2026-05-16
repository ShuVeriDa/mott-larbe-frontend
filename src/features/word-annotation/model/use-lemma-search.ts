"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/lib/debounce";
import { annotationApi, annotationKeys } from "../api";

export const useLemmaSearch = (q: string, language = "CHE") => {
	const debouncedQ = useDebounce(q, 300);

	return useQuery({
		queryKey: annotationKeys.lemmaSearch(debouncedQ, language),
		queryFn: () => annotationApi.searchLemmas(debouncedQ, language),
		enabled: debouncedQ.trim().length >= 2,
		staleTime: 60_000,
	});
};
