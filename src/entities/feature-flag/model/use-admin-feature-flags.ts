"use client";

import { useQuery } from "@tanstack/react-query";
import { featureFlagApi, featureFlagKeys } from "../api";
import type { GetFeatureFlagsQuery } from "../api";

export const useAdminFeatureFlags = (query: GetFeatureFlagsQuery = {}) =>
	useQuery({
		queryKey: featureFlagKeys.list(query),
		queryFn: () => featureFlagApi.getFlags(query),
		staleTime: 15_000,
	});
