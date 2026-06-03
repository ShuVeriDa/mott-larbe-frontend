"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { textSubmissionsApi } from "./api";
import type {
	CreateTextSubmissionDto,
	GetMyTextSubmissionsParams,
	GetTextSubmissionsParams,
	ReviewTextSubmissionDto,
	UpdateTextSubmissionDto,
} from "./types";

export const textSubmissionKeys = {
	all: ["text-submissions"] as const,
	mine: (params?: GetMyTextSubmissionsParams) =>
		[...textSubmissionKeys.all, "mine", params] as const,
	list: (params?: GetTextSubmissionsParams) =>
		[...textSubmissionKeys.all, "list", params] as const,
	detail: (id: string) => [...textSubmissionKeys.all, "detail", id] as const,
	// Owner-scoped draft detail — separate cache slot from admin detail
	ownedDetail: (id: string) => [...textSubmissionKeys.all, "owned-detail", id] as const,
	stats: () => [...textSubmissionKeys.all, "stats"] as const,
};

// ─── Existing hooks — unchanged ────────────────────────────────────────────

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

// ─── New hooks (owner draft lifecycle) ────────────────────────────────────

// Owner-scoped single draft/rejected submission with full content.
// Defense in depth: caller should redirect if data.userId !== currentUserId.
// staleTime: 30s — draft status changes frequently.
export const useOwnedTextSubmission = (id: string) =>
	useQuery({
		queryKey: textSubmissionKeys.ownedDetail(id),
		queryFn: () => textSubmissionsApi.getOwnedById(id),
		enabled: !!id,
		staleTime: 30_000,
	});

export const useUpdateTextSubmission = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateTextSubmissionDto }) =>
			textSubmissionsApi.update(id, dto),
		// retry: 0 — write ops must not be silently retried
		retry: 0,
		onSuccess: (data) => {
			qc.setQueryData(textSubmissionKeys.ownedDetail(data.id), data);
			qc.invalidateQueries({ queryKey: textSubmissionKeys.mine() });
		},
	});
};

export const useDeleteTextSubmission = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => textSubmissionsApi.remove(id),
		retry: 0,
		onSuccess: (_data, id) => {
			qc.removeQueries({ queryKey: textSubmissionKeys.ownedDetail(id) });
			qc.invalidateQueries({ queryKey: textSubmissionKeys.mine() });
		},
	});
};

export const useSubmitTextSubmission = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => textSubmissionsApi.submit(id),
		retry: 0,
		onSuccess: (data) => {
			qc.setQueryData(textSubmissionKeys.ownedDetail(data.id), data);
			qc.invalidateQueries({ queryKey: textSubmissionKeys.mine() });
			qc.invalidateQueries({ queryKey: textSubmissionKeys.stats() });
		},
		// Re-fetch actual status on error so UI reflects real server state
		onError: (_err, id) => {
			qc.invalidateQueries({ queryKey: textSubmissionKeys.ownedDetail(id) });
			qc.invalidateQueries({ queryKey: textSubmissionKeys.mine() });
		},
	});
};
