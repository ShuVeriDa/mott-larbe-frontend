import { http } from "@/shared/api";
import type {
	AddToDictionaryDto,
	FetchUnknownWordsQuery,
	LemmaSearchItem,
	TextListItem,
	UnknownWordContextsResponse,
	UnknownWordStats,
	UnknownWordsListResponse,
} from "./types";

const BASE = "/admin/unknown-words";

export const adminUnknownWordApi = {
	list: async (
		query: FetchUnknownWordsQuery = {},
	): Promise<UnknownWordsListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.q) params.q = query.q;
		if (query.textId) params.textId = query.textId;
		if (query.sort) params.sort = query.sort;
		if (query.tab) params.tab = query.tab;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 20;
		const { data } = await http.get<UnknownWordsListResponse>(BASE, { params });
		return data;
	},

	stats: async (): Promise<UnknownWordStats> => {
		const { data } = await http.get<UnknownWordStats>(`${BASE}/stats`);
		return data;
	},

	getContexts: async (id: string): Promise<UnknownWordContextsResponse> => {
		const { data } = await http.get<UnknownWordContextsResponse>(
			`${BASE}/${id}/contexts`,
		);
		return data;
	},

	addToDictionary: async (
		id: string,
		dto: AddToDictionaryDto,
	): Promise<{ lemma: unknown; resolvedUnknownWordId: string }> => {
		const { data } = await http.post<{
			lemma: unknown;
			resolvedUnknownWordId: string;
		}>(`${BASE}/${id}/add-to-dictionary`, dto);
		return data;
	},

	link: async (
		id: string,
		lemmaId: string,
	): Promise<{ lemmaId: string; resolvedUnknownWordId: string }> => {
		const { data } = await http.post<{
			lemmaId: string;
			resolvedUnknownWordId: string;
		}>(`${BASE}/${id}/link`, { lemmaId });
		return data;
	},

	deleteOne: async (id: string): Promise<void> => {
		await http.delete(`${BASE}/${id}`);
	},

	deleteAll: async (): Promise<{ deleted: number }> => {
		const { data } = await http.delete<{ deleted: number }>(BASE);
		return data;
	},

	bulkDelete: async (ids: string[]): Promise<{ deleted: number }> => {
		const { data } = await http.post<{ deleted: number }>(
			`${BASE}/bulk/delete`,
			{ ids },
		);
		return data;
	},

	exportCsv: async (query: FetchUnknownWordsQuery = {}): Promise<Blob> => {
		const { data } = await http.get<Blob>(`${BASE}/export`, {
			params: { ...query, format: "csv" },
			responseType: "blob",
		});
		return data;
	},

	getTexts: async (): Promise<TextListItem[]> => {
		const { data } = await http.get<{ items: TextListItem[] }>(
			"/admin/texts",
			{ params: { limit: 100 } },
		);
		return data.items;
	},

	searchLemmas: async (q: string): Promise<LemmaSearchItem[]> => {
		const { data } = await http.get<{ items: LemmaSearchItem[] }>(
			"/admin/dictionary",
			{ params: { q, language: "CHE", limit: 20 } },
		);
		return data.items;
	},
};
