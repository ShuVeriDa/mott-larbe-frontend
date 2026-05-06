"use client";

import { useQuery } from "@tanstack/react-query";
import { featureFlagApi, featureFlagKeys } from "../api";

export const useAdminFeatureFlagItemHistory = (flagId: string | null, limit = 20) =>
	useQuery({
		queryKey: featureFlagKeys.flagHistory(flagId ?? ""),
		queryFn: () => featureFlagApi.getFlagHistory(flagId!, limit),
		enabled: !!flagId,
		staleTime: 15_000,
	});
