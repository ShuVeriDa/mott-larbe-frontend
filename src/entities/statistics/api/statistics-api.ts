import { http } from "@/shared/api";
import type { ProfileSummary, StatisticsQuery, StatisticsResponse } from "./types";

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

	profileSummary: async (): Promise<ProfileSummary> => {
		const { data } = await http.get<ProfileSummary>("/statistics/me/profile-summary");
		return data;
	},

	logReadingSession: (textId: string, durationSeconds: number, wordsRead?: number): Promise<void> => {
		return http
			.post("/statistics/reading-time", { textId, durationSeconds, ...(wordsRead !== undefined && { wordsRead }) })
			.then(() => undefined)
			.catch(() => undefined);
	},
};
