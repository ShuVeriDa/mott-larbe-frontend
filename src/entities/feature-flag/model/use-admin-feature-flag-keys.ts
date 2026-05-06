"use client";

import { useQuery } from "@tanstack/react-query";
import { featureFlagApi, featureFlagKeys } from "../api";
import type { GetFeatureFlagKeysQuery } from "../api";

export const useAdminFeatureFlagKeys = (query: GetFeatureFlagKeysQuery = {}) =>
	useQuery({
		queryKey: featureFlagKeys.keys(query),
		queryFn: () => featureFlagApi.getKeys(query),
		staleTime: 60_000,
	});
