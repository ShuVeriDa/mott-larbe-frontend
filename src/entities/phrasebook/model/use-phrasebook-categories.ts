"use client";

import { useQuery } from "@tanstack/react-query";
import { phrasebookApi, phrasebookKeys } from "../api";

export const usePhrasebookCategories = () =>
	useQuery({
		queryKey: phrasebookKeys.categories(),
		queryFn: () => phrasebookApi.categories(),
		staleTime: 5 * 60 * 1000,
	});
