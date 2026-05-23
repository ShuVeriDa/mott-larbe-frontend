"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { suggestionsApi } from "./api";
import type {
	CreateSuggestionDto,
	GetMySuggestionsParams,
	GetSuggestionsParams,
	ReviewSuggestionDto,
} from "./types";

export const suggestionKeys = {
	all: ["suggestions"] as const,
	mine: (params?: GetMySuggestionsParams) =>
		[...suggestionKeys.all, "mine", params] as const,
	list: (params?: GetSuggestionsParams) =>
		[...suggestionKeys.all, "list", params] as const,
	detail: (id: string) => [...suggestionKeys.all, "detail", id] as const,
	adjacent: (id: string, status?: string) =>
		[...suggestionKeys.all, "adjacent", id, status] as const,
	stats: () => [...suggestionKeys.all, "stats"] as const,
};

export const useMySuggestions = (params?: GetMySuggestionsParams) =>
	useQuery({
		queryKey: suggestionKeys.mine(params),
		queryFn: () => suggestionsApi.getMine(params),
	});

export const useSuggestions = (params?: GetSuggestionsParams) =>
	useQuery({
		queryKey: suggestionKeys.list(params),
		queryFn: () => suggestionsApi.getAll(params),
	});

export const useSuggestion = (id: string) =>
	useQuery({
		queryKey: suggestionKeys.detail(id),
		queryFn: () => suggestionsApi.getById(id),
		enabled: !!id,
	});

export const useAdjacentSuggestions = (id: string, status?: string) =>
	useQuery({
		queryKey: suggestionKeys.adjacent(id, status),
		queryFn: () => suggestionsApi.getAdjacent(id, status),
		enabled: !!id,
	});

export const useSuggestionStats = () =>
	useQuery({
		queryKey: suggestionKeys.stats(),
		queryFn: suggestionsApi.getStats,
	});

export const useCreateSuggestion = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateSuggestionDto) => suggestionsApi.create(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: suggestionKeys.mine() });
		},
	});
};

export const useReviewSuggestion = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: ReviewSuggestionDto }) =>
			suggestionsApi.review(id, dto),
		onSuccess: (data) => {
			qc.setQueryData(suggestionKeys.detail(data.id), data);
			qc.invalidateQueries({ queryKey: suggestionKeys.list() });
			qc.invalidateQueries({ queryKey: suggestionKeys.stats() });
		},
	});
};
