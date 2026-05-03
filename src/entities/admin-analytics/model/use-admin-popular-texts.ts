import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsApi, adminAnalyticsKeys } from "../api";
import type { FetchAdminAnalyticsQuery, PopularBy } from "../api";

export const useAdminPopularTexts = (
	query?: Pick<FetchAdminAnalyticsQuery, "range" | "dateFrom" | "dateTo"> & {
		popularBy?: PopularBy;
		popularLimit?: number;
	},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.popularTexts({
			range: query?.range,
			popularBy: query?.popularBy,
		}),
		queryFn: () => adminAnalyticsApi.popularTexts(query),
		placeholderData: (prev) => prev,
	});
