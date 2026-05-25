"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardKeys } from "@/entities/dashboard/api/dashboard-keys";
import type { DashboardResponse } from "@/entities/dashboard/api/types";
import { subscriptionApi, subscriptionKeys } from "../api";

export const useMySubscription = () => {
	const qc = useQueryClient();

	return useQuery({
		queryKey: subscriptionKeys.me(),
		queryFn: () => {
			const cached = qc.getQueryData<DashboardResponse>(dashboardKeys.me());
			if (cached && "subscription" in cached) return cached.subscription;
			return subscriptionApi.getMySubscription();
		},
	});
};
