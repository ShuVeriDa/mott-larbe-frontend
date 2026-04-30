"use client";

import { useQuery } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "../api";
import type { DictionaryListQuery } from "../api";

export const useDictionaryNeighbors = (
	id: string | undefined,
	query: DictionaryListQuery = {},
) =>
	useQuery({
		queryKey: id
			? dictionaryKeys.neighbors(id, query)
			: ["dictionary", "neighbors", "_", query],
		queryFn: () => dictionaryApi.neighbors(id as string, query),
		enabled: Boolean(id),
	});
