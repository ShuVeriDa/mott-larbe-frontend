"use client";

import { useQuery } from "@tanstack/react-query";
import { phrasebookApi, phrasebookKeys } from "../api";

export const usePhraseReviewStats = () =>
	useQuery({
		queryKey: phrasebookKeys.reviewStats(),
		queryFn: () => phrasebookApi.reviewStats(),
		staleTime: 0,
	});
