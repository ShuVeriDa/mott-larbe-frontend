"use client";

import { useQuery } from "@tanstack/react-query";
import { featureFlagApi, featureFlagKeys } from "../api";

export const useAdminFeatureFlagHistoryActors = () =>
	useQuery({
		queryKey: featureFlagKeys.historyActors(),
		queryFn: () => featureFlagApi.getHistoryActors(),
		staleTime: 60_000,
	});
