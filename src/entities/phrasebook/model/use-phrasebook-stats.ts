"use client";

import { useQuery } from "@tanstack/react-query";
import { phrasebookApi, phrasebookKeys } from "../api";

export const usePhrasebookStats = () =>
	useQuery({
		queryKey: phrasebookKeys.stats(),
		queryFn: () => phrasebookApi.stats(),
	});
