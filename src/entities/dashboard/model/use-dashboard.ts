"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userKeys } from "@/entities/user";
import { subscriptionKeys } from "@/entities/subscription";
import { dashboardApi, dashboardQueryOptions } from "../api";

export const useDashboard = () => {
	const qc = useQueryClient();
	const { queryKey, staleTime } = dashboardQueryOptions();

	return useQuery({
		queryKey,
		staleTime,
		queryFn: async () => {
			const data = await dashboardApi.me();
			qc.setQueryData(userKeys.me(), data.user);
			qc.setQueryData(subscriptionKeys.me(), data.subscription);
			return data;
		},
	});
};
