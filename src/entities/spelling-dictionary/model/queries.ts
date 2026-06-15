"use client";

import { queryOptions } from "@tanstack/react-query";
import { spellingDictionaryApi } from "../api/spelling-dictionary-api";
import { spellingDictionaryKeys } from "../api/spelling-dictionary-keys";
import type { FetchSpellingEntriesParams } from "../api/types";

const ONE_HOUR = 1000 * 60 * 60;

export const spellingDictionaryQueryOptions = queryOptions({
	queryKey: spellingDictionaryKeys.all(),
	queryFn: spellingDictionaryApi.getAll,
	staleTime: ONE_HOUR,
	gcTime: ONE_HOUR * 2,
});

export const adminSpellingDictionaryQueryOptions = (
	params: FetchSpellingEntriesParams,
) =>
	queryOptions({
		queryKey: spellingDictionaryKeys.adminList(params),
		queryFn: () => spellingDictionaryApi.adminList(params),
		staleTime: 1000 * 60 * 2,
	});
