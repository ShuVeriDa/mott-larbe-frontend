import { http } from "@/shared/api";
import type { StatisticsQuery, StatisticsResponse } from "./types";

export const statisticsApi = {
	me: async (query: StatisticsQuery = {}): Promise<StatisticsResponse> => {
		const params: Record<string, string | number> = {};
		if (query.period) params.period = query.period;
		if (query.activityLimit) params.activityLimit = query.activityLimit;

		const { data } = await http.get<StatisticsResponse>("/statistics/me", {
			params,
		});
		return data;
	},
};
