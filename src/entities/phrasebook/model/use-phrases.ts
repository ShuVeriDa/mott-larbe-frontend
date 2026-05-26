"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { phrasebookApi, phrasebookKeys } from "../api";
import type { PhrasesQuery } from "../api";

export const usePhrases = (query: PhrasesQuery) =>
	useQuery({
		queryKey: phrasebookKeys.phrases(query),
		queryFn: () => phrasebookApi.phrases(query),
		placeholderData: keepPreviousData,
		staleTime: 2 * 60 * 1000,
	});
