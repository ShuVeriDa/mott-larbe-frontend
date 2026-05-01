import { http } from "@/shared/api";
import type {
	DeckDueResponse,
	DeckStats,
	RateDeckBody,
	RateDeckResponse,
} from "./types";

export const deckApi = {
	stats: async (): Promise<DeckStats> => {
		const { data } = await http.get<DeckStats>("/deck/stats");
		return data;
	},

	due: async (): Promise<DeckDueResponse> => {
		const { data } = await http.get<DeckDueResponse>("/deck/due");
		return data;
	},

	rate: async (
		lemmaId: string,
		body: RateDeckBody,
	): Promise<RateDeckResponse> => {
		const { data } = await http.post<RateDeckResponse>(
			`/deck/rate/${lemmaId}`,
			body,
		);
		return data;
	},
};
