"use client";

import { useQuery } from "@tanstack/react-query";
import { statisticsApi, statisticsKeys } from "../api";

export const useProfileSummary = () =>
	useQuery({
		queryKey: statisticsKeys.profileSummary(),
		queryFn: () => statisticsApi.profileSummary(),
		staleTime: 60_000,
	});
