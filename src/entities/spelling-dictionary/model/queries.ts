"use client";

import { queryOptions } from "@tanstack/react-query";
import { spellingDictionaryApi } from "../api/spelling-dictionary-api";
import { spellingDictionaryKeys } from "../api/spelling-dictionary-keys";
import type {
	FetchSpellingEntriesParams,
	FetchSpellingOccurrencesParams,
	FetchSpellingOccurrenceTextsParams,
	FindReplaceOccurrencesParams,
	FindReplaceTextsParams,
} from "../api/types";

const ONE_HOUR = 1000 * 60 * 60;
const ONE_MINUTE = 1000 * 60;

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

export const spellingOccurrencesQueryOptions = (
	id: string,
	params: FetchSpellingOccurrencesParams,
) =>
	queryOptions({
		queryKey: spellingDictionaryKeys.occurrences(id, params),
		queryFn: () => spellingDictionaryApi.getOccurrences(id, params),
		staleTime: ONE_MINUTE,
	});

export const spellingOccurrenceTextsQueryOptions = (
	id: string,
	params: FetchSpellingOccurrenceTextsParams,
) =>
	queryOptions({
		queryKey: spellingDictionaryKeys.occurrenceTexts(id, params),
		queryFn: () => spellingDictionaryApi.getOccurrenceTexts(id, params),
		staleTime: ONE_MINUTE,
	});

export const findReplaceOccurrencesQueryOptions = (
	params: FindReplaceOccurrencesParams,
) =>
	queryOptions({
		queryKey: spellingDictionaryKeys.findReplaceOccurrences(params),
		queryFn: () => spellingDictionaryApi.findReplaceOccurrences(params),
		staleTime: ONE_MINUTE,
		enabled: params.wrongForm.trim().length > 0,
	});

export const findReplaceTextsQueryOptions = (params: FindReplaceTextsParams) =>
	queryOptions({
		queryKey: spellingDictionaryKeys.findReplaceTexts(params),
		queryFn: () => spellingDictionaryApi.findReplaceTexts(params),
		staleTime: ONE_MINUTE,
		enabled: params.wrongForm.trim().length > 0,
	});
