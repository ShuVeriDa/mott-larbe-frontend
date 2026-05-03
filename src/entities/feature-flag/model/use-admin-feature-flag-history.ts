"use client";

import { useQuery } from "@tanstack/react-query";
import { featureFlagApi, featureFlagKeys } from "../api";
import type { GetFeatureFlagHistoryQuery } from "../api";

export const useAdminFeatureFlagHistory = (query: GetFeatureFlagHistoryQuery = {}) =>
	useQuery({
		queryKey: featureFlagKeys.history(query),
		queryFn: () => featureFlagApi.getHistory(query),
		staleTime: 15_000,
	});
