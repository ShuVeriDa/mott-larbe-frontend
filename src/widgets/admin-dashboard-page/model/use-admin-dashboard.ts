"use client";
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDashboardApi, adminDashboardKeys } from "@/entities/admin-dashboard";
import { featureFlagApi } from "@/entities/feature-flag";
import type { DashboardPeriod, AdminDashboardResponse } from "@/entities/admin-dashboard";

export const useAdminDashboard = () => {
	const queryClient = useQueryClient();
	const [period, setPeriod] = useState<DashboardPeriod>("month");

	const dashboardQuery = useQuery({
		queryKey: adminDashboardKeys.detail({ period }),
		queryFn: () => adminDashboardApi.getDashboard({ period }),
		staleTime: 60_000,
	});

	const toggleMutation = useMutation({
		mutationFn: ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
			featureFlagApi.toggleFlag(id, isEnabled),
		onMutate: async ({ id, isEnabled }) => {
			await queryClient.cancelQueries({ queryKey: adminDashboardKeys.root });
			const previousData = queryClient.getQueriesData<AdminDashboardResponse>({
				queryKey: adminDashboardKeys.root,
			});
			queryClient.setQueriesData<AdminDashboardResponse>(
				{ queryKey: adminDashboardKeys.root },
				(old) => {
					if (!old) return old;
					return {
						...old,
						featureFlags: old.featureFlags.map((f) =>
							f.id === id ? { ...f, isEnabled } : f,
						),
					};
				},
			);
			return { previousData };
		},
		onError: (_err, _vars, context) => {
			if (!context) return;
			for (const [queryKey, data] of context.previousData) {
				queryClient.setQueryData(queryKey, data);
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: adminDashboardKeys.root });
		},
	});

	const handleToggleFlag = (id: string, currentEnabled: boolean) => {
		toggleMutation.mutate({ id, isEnabled: !currentEnabled });
	};

	const handleExport = async () => {
		try {
			const csv = await adminDashboardApi.exportDashboard({ period }, "csv");
			const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `dashboard-${period}-${new Date().toISOString().slice(0, 10)}.csv`;
			a.click();
			URL.revokeObjectURL(url);
		} catch {}
	};

	return {
		period,
		setPeriod,
		dashboardQuery,
		handleToggleFlag,
		handleExport,
	};
};
