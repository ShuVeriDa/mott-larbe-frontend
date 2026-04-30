"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { dictionaryApi, dictionaryKeys } from "../api";
import type { DictionaryListQuery } from "../api";

export const useDictionaryList = (query: DictionaryListQuery) =>
	useQuery({
		queryKey: dictionaryKeys.list(query),
		queryFn: () => dictionaryApi.list(query),
		placeholderData: keepPreviousData,
	});
