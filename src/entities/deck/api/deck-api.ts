import { http } from "@/shared/api";
import type {
	DeckDailyWord,
	DeckDueResponse,
	DeckSettings,
	DeckStats,
	RateDeckBody,
	RateDeckResponse,
	UpdateDeckSettingsBody,
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

	getSettings: async (): Promise<DeckSettings> => {
		const { data } = await http.get<DeckSettings>("/deck/settings");
		return data;
	},

	updateSettings: async (body: UpdateDeckSettingsBody): Promise<DeckSettings> => {
		const { data } = await http.patch<DeckSettings>("/deck/settings", body);
		return data;
	},

	daily: async (): Promise<DeckDailyWord[]> => {
		const { data } = await http.get<DeckDailyWord[]>("/deck/daily");
		return data;
	},

	addWord: async (lemmaId: string): Promise<RateDeckResponse> => {
		const { data } = await http.post<RateDeckResponse>(`/deck/add/${lemmaId}`);
		return data;
	},

	addToRepeat: async (lemmaId: string): Promise<void> => {
		await http.post(`/deck/repeat/${lemmaId}`);
	},

	returnFromRepeat: async (lemmaId: string): Promise<void> => {
		await http.post(`/deck/repeat/${lemmaId}/return`);
	},
};
