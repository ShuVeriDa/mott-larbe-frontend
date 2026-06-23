import { http } from "@/shared/api";
import type {
	Phrase,
	PhrasebookCategory,
	PhrasebookSaveResponse,
	PhrasebookStats,
	PhrasesQuery,
	GetPhrasesResponse,
	SuggestPhraseDto,
	SuggestPhraseResponse,
	PhraseDue,
	PhraseRateResponse,
	PhraseReviewQuality,
	PhraseReviewStats,
	PhraseCategoryProgress,
} from "./types";

const buildParams = (
	query: PhrasesQuery,
): Record<string, string | boolean | number> => {
	const params: Record<string, string | boolean | number> = {};
	if (query.categoryId) params.categoryId = query.categoryId;
	if (query.lang) params.lang = query.lang;
	if (query.saved) params.saved = true;
	if (query.search) params.search = query.search;
	if (query.page) params.page = query.page;
	if (query.limit) params.limit = query.limit;
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

	phrases: async (query: PhrasesQuery): Promise<GetPhrasesResponse> => {
		const { data } = await http.get<GetPhrasesResponse>("/phrasebook/phrases", {
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

	reviewStats: async (): Promise<PhraseReviewStats> => {
		const { data } = await http.get<PhraseReviewStats>("/phrasebook/review/stats");
		return data;
	},

	reviewDue: async (params?: { categoryId?: string; savedOnly?: boolean }): Promise<PhraseDue[]> => {
		const { data } = await http.get<PhraseDue[]>("/phrasebook/review/due", {
			params,
		});
		return data;
	},

	categoryProgress: async (): Promise<PhraseCategoryProgress[]> => {
		const { data } = await http.get<PhraseCategoryProgress[]>("/phrasebook/review/categories");
		return data;
	},

	ratePhrase: async (phraseId: string, quality: PhraseReviewQuality): Promise<PhraseRateResponse> => {
		const { data } = await http.post<PhraseRateResponse>(
			`/phrasebook/progress/${phraseId}/rate`,
			{ quality },
		);
		return data;
	},
};
