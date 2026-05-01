"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi, dashboardKeys } from "../api";

export const useDashboard = () =>
	useQuery({
		queryKey: dashboardKeys.me(),
		queryFn: () => dashboardApi.me(),
		staleTime: 60_000,
	});
