"use client";

import { useQuery } from "@tanstack/react-query";
import { dictionaryApi } from "../api";

export const useDictionaryWordContexts = (lemmaId: string | null | undefined) =>
	useQuery({
		queryKey: ["dictionary", "wordContexts", lemmaId] as const,
		queryFn: () => dictionaryApi.wordContexts(lemmaId as string),
		enabled: !!lemmaId,
		staleTime: 60_000,
	});
