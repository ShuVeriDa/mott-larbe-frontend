"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDashboardApi, adminDashboardKeys } from "@/entities/admin-dashboard";
import { featureFlagApi } from "@/entities/feature-flag";
import type { DashboardPeriod } from "@/entities/admin-dashboard";

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
