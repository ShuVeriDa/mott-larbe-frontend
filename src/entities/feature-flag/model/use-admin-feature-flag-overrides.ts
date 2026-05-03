"use client";

import { useQuery } from "@tanstack/react-query";
import { featureFlagApi, featureFlagKeys } from "../api";
import type { GetFeatureFlagOverridesQuery } from "../api";

export const useAdminFeatureFlagOverrides = (query: GetFeatureFlagOverridesQuery = {}) =>
	useQuery({
		queryKey: featureFlagKeys.overrides(query),
		queryFn: () => featureFlagApi.getOverrides(query),
		staleTime: 15_000,
	});
