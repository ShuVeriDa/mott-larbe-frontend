import { useQuery } from "@tanstack/react-query";
import { adminAnalyticsApi, adminAnalyticsKeys } from "../api";
import type { DifficultBy, FetchAdminAnalyticsQuery } from "../api";

export const useAdminDifficultTexts = (
	query?: Pick<FetchAdminAnalyticsQuery, "range" | "dateFrom" | "dateTo"> & {
		difficultBy?: DifficultBy;
		difficultLimit?: number;
	},
) =>
	useQuery({
		queryKey: adminAnalyticsKeys.difficultTexts({
			range: query?.range,
			difficultBy: query?.difficultBy,
		}),
		queryFn: () => adminAnalyticsApi.difficultTexts(query),
		placeholderData: (prev) => prev,
	});
