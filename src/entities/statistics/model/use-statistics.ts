"use client";

import { useQuery } from "@tanstack/react-query";
import { statisticsApi, statisticsKeys } from "../api";
import type { StatisticsQuery } from "../api";

export const useStatistics = (query: StatisticsQuery = {}) =>
	useQuery({
		queryKey: statisticsKeys.me(query),
		queryFn: () => statisticsApi.me(query),
		staleTime: 60_000,
	});
