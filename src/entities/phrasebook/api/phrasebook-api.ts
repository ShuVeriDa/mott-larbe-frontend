import { http } from "@/shared/api";
import type {
	Phrase,
	PhrasebookCategory,
	PhrasebookSaveResponse,
	PhrasebookStats,
	PhrasesQuery,
	SuggestPhraseDto,
	SuggestPhraseResponse,
} from "./types";

const buildParams = (
	query: PhrasesQuery,
): Record<string, string | boolean> => {
	const params: Record<string, string | boolean> = {};
	if (query.categoryId) params.categoryId = query.categoryId;
	if (query.lang) params.lang = query.lang;
	if (query.saved) params.saved = true;
	if (query.search) params.search = query.search;
	return params;
};

export const phrasebookApi = {
	stats: async (): Promise<PhrasebookStats> => {
		const { data } = await http.get<PhrasebookStats>("/phrasebook/stats");
		return data;
	},

	categories: async (): Promise<PhrasebookCategory[]> => {
		const { data } =
			await http.get<PhrasebookCategory[]>("/phrasebook/categories");
		return data;
	},

	phrases: async (query: PhrasesQuery): Promise<Phrase[]> => {
		const { data } = await http.get<Phrase[]>("/phrasebook/phrases", {
			params: buildParams(query),
		});
		return data;
	},

	toggleSave: async (phraseId: string): Promise<PhrasebookSaveResponse> => {
		const { data } = await http.post<PhrasebookSaveResponse>(
			`/phrasebook/saves/${phraseId}`,
		);
		return data;
	},

	suggest: async (
		body: SuggestPhraseDto,
	): Promise<SuggestPhraseResponse> => {
		const { data } = await http.post<SuggestPhraseResponse>(
			"/phrasebook/suggestions",
			body,
		);
		return data;
	},
};
