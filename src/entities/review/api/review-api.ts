import { http } from "@/shared/api";
import type {
	RateReviewBody,
	RateReviewResponse,
	ReviewDueWord,
	ReviewStats,
} from "./types";

export const reviewApi = {
	stats: async (): Promise<ReviewStats> => {
		const { data } = await http.get<ReviewStats>("/progress/review/stats");
		return data;
	},

	due: async (limit?: number): Promise<ReviewDueWord[]> => {
		const { data } = await http.get<ReviewDueWord[]>("/progress/review/due", {
			params: limit ? { limit } : undefined,
		});
		return data;
	},

	rate: async (
		lemmaId: string,
		body: RateReviewBody,
	): Promise<RateReviewResponse> => {
		const { data } = await http.post<RateReviewResponse>(
			`/progress/review/${lemmaId}`,
			body,
		);
		return data;
	},
};
