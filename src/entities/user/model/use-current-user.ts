"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "@/entities/dashboard/api/dashboard-keys";
import type { DashboardResponse } from "@/entities/dashboard/api/types";
import { userApi, userKeys } from "../api";

export const useCurrentUser = () => {
	const qc = useQueryClient();

	return useQuery({
		queryKey: userKeys.me(),
		queryFn: () => {
			const cached = qc.getQueryData<DashboardResponse>(dashboardKeys.me());
			if (cached?.user) return cached.user;
			return userApi.getMe();
		},
		staleTime: 60_000,
	});
};
