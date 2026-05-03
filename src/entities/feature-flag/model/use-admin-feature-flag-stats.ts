"use client";

import { useQuery } from "@tanstack/react-query";
import { featureFlagApi, featureFlagKeys } from "../api";

export const useAdminFeatureFlagStats = () =>
	useQuery({
		queryKey: featureFlagKeys.stats(),
		queryFn: () => featureFlagApi.getStats(),
		staleTime: 30_000,
	});
