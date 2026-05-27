"use client";

import { useQuery } from "@tanstack/react-query";
import { phrasebookApi, phrasebookKeys } from "../api";

export const usePhraseReviewDue = (params?: { categoryId?: string; savedOnly?: boolean }) =>
	useQuery({
		queryKey: phrasebookKeys.reviewDue(params),
		queryFn: () => phrasebookApi.reviewDue(params),
		staleTime: 15_000,
	});
