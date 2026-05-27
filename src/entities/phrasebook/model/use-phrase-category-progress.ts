"use client";

import { useQuery } from "@tanstack/react-query";
import { phrasebookApi, phrasebookKeys } from "../api";

export const usePhraseCategoryProgress = () =>
	useQuery({
		queryKey: phrasebookKeys.categoryProgress(),
		queryFn: () => phrasebookApi.categoryProgress(),
		staleTime: 30_000,
	});
