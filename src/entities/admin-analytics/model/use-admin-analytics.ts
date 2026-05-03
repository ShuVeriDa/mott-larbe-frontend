import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsApi, adminAnalyticsKeys } from "../api";
import type { FetchAdminAnalyticsQuery } from "../api";

export const useAdminAnalytics = (query?: FetchAdminAnalyticsQuery) =>
	useQuery({
		queryKey: adminAnalyticsKeys.overview(query),
		queryFn: () => adminAnalyticsApi.overview(query),
		placeholderData: (prev) => prev,
	});
