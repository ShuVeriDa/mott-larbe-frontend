"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { textSubmissionsApi } from "./api";
import type {
	CreateTextSubmissionDto,
	GetMyTextSubmissionsParams,
	GetTextSubmissionsParams,
	ReviewTextSubmissionDto,
} from "./types";

export const textSubmissionKeys = {
	all: ["text-submissions"] as const,
	mine: (params?: GetMyTextSubmissionsParams) =>
		[...textSubmissionKeys.all, "mine", params] as const,
	list: (params?: GetTextSubmissionsParams) =>
		[...textSubmissionKeys.all, "list", params] as const,
	detail: (id: string) => [...textSubmissionKeys.all, "detail", id] as const,
	stats: () => [...textSubmissionKeys.all, "stats"] as const,
};

export const useMyTextSubmissions = (params?: GetMyTextSubmissionsParams) =>
	useQuery({
		queryKey: textSubmissionKeys.mine(params),
		queryFn: () => textSubmissionsApi.getMine(params),
		staleTime: 30_000,
	});

export const useTextSubmissions = (params?: GetTextSubmissionsParams) =>
	useQuery({
		queryKey: textSubmissionKeys.list(params),
		queryFn: () => textSubmissionsApi.getAll(params),
		staleTime: 30_000,
	});

export const useTextSubmission = (id: string) =>
	useQuery({
		queryKey: textSubmissionKeys.detail(id),
		queryFn: () => textSubmissionsApi.getById(id),
		enabled: !!id,
		staleTime: 60_000,
	});

export const useTextSubmissionStats = () =>
	useQuery({
		queryKey: textSubmissionKeys.stats(),
		queryFn: textSubmissionsApi.getStats,
		staleTime: 30_000,
	});

export const useCreateTextSubmission = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateTextSubmissionDto) => textSubmissionsApi.create(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: textSubmissionKeys.mine() });
		},
	});
};

export const useReviewTextSubmission = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: ReviewTextSubmissionDto }) =>
			textSubmissionsApi.review(id, dto),
		onSuccess: (data) => {
			qc.setQueryData(textSubmissionKeys.detail(data.id), data);
			qc.invalidateQueries({ queryKey: textSubmissionKeys.list() });
			qc.invalidateQueries({ queryKey: textSubmissionKeys.stats() });
		},
	});
};
