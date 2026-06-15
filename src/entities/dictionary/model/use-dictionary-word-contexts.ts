"use client";

import { useQuery } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "../api";

export const useDictionaryWordContexts = (lemmaId: string | null | undefined) =>
	useQuery({
		queryKey: dictionaryKeys.wordContexts(lemmaId),
		queryFn: () => dictionaryApi.wordContexts(lemmaId as string),
		enabled: !!lemmaId,
		staleTime: 60_000,
	});
