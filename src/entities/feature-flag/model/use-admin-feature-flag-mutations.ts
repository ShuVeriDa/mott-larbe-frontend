"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { featureFlagApi, featureFlagKeys } from "../api";
import type {
	CreateFeatureFlagDto,
	CreateFeatureFlagOverrideDto,
	ImportFeatureFlagsDto,
	PaginatedFeatureFlags,
	UpdateFeatureFlagDto,
} from "../api";

const invalidate = (qc: ReturnType<typeof useQueryClient>) => {
	void qc.invalidateQueries({ queryKey: featureFlagKeys.root });
};

export const useCreateFeatureFlag = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateFeatureFlagDto) => featureFlagApi.createFlag(dto),
		onSuccess: () => invalidate(qc),
	});
};

export const useUpdateFeatureFlag = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateFeatureFlagDto }) =>
			featureFlagApi.updateFlag(id, dto),
		onSuccess: () => invalidate(qc),
	});
};

export const useToggleFeatureFlag = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
			featureFlagApi.toggleFlag(id, isEnabled),
		onMutate: async ({ id, isEnabled }) => {
			await qc.cancelQueries({ queryKey: featureFlagKeys.root });
			const snapshots = qc.getQueriesData<PaginatedFeatureFlags>({
				queryKey: ["feature-flags", "list"],
			});
			for (const [key, data] of snapshots) {
				if (!data) continue;
				qc.setQueryData<PaginatedFeatureFlags>(key, {
					...data,
					items: data.items.map((f) => (f.id === id ? { ...f, isEnabled } : f)),
				});
			}
			return { snapshots };
		},
		onError: (_err, _vars, ctx) => {
			if (!ctx) return;
			for (const [key, data] of ctx.snapshots) {
				qc.setQueryData(key, data);
			}
		},
		onSettled: () => invalidate(qc),
	});
};

export const useDeleteFeatureFlag = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => featureFlagApi.deleteFlag(id),
		onSuccess: () => invalidate(qc),
	});
};

export const useDuplicateFeatureFlag = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, key }: { id: string; key: string }) =>
			featureFlagApi.duplicateFlag(id, key),
		onSuccess: () => invalidate(qc),
	});
};

export const useDeleteFeatureFlagOverride = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (overrideId: string) => featureFlagApi.deleteOverride(overrideId),
		onSuccess: () => invalidate(qc),
	});
};

export const useCreateFeatureFlagOverride = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateFeatureFlagOverrideDto) => featureFlagApi.createOverride(dto),
		onSuccess: () => invalidate(qc),
	});
};

export const useImportFeatureFlags = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: ImportFeatureFlagsDto) => featureFlagApi.importFlags(dto),
		onSuccess: () => invalidate(qc),
	});
};
