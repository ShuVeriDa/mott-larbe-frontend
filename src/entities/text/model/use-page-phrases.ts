"use client";

import { useQuery } from "@tanstack/react-query";
import { textApi } from "../api/text-api";
import { textKeys } from "../api/text-keys";

export const usePagePhrases = (textId: string, pageNumber: number) =>
	useQuery({
		queryKey: textKeys.phrases(textId, pageNumber),
		queryFn: () => textApi.getPagePhrases(textId, pageNumber),
		enabled: Boolean(textId) && Number.isFinite(pageNumber) && pageNumber > 0,
		staleTime: 60_000,
	});
