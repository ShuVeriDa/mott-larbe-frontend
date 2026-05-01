"use client";

import { useQuery } from "@tanstack/react-query";
import { wordApi, wordKeys } from "../api";

export const useWordExamples = (lemmaId: string | null) =>
	useQuery({
		queryKey: lemmaId
			? wordKeys.examples(lemmaId)
			: ["word", "examples", "_"],
		queryFn: () => wordApi.examples(lemmaId as string),
		enabled: Boolean(lemmaId),
		staleTime: 5 * 60_000,
	});
