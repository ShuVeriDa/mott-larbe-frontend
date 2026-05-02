import { http } from "@/shared/api";
import type {
	AddToDictionaryPayload,
	BulkDeleteResponse,
	ClearAllResponse,
	FetchUnknownWordsQuery,
	LinkToLemmaPayload,
	UnknownWordContextsResponse,
	UnknownWordListItem,
	UnknownWordsListResponse,
	UnknownWordsStats,
} from "./types";

export const unknownWordApi = {
	list: async (
		query: FetchUnknownWordsQuery = {},
	): Promise<UnknownWordsListResponse> => {
		const params: Record<string, unknown> = {};
		if (query.q) params.q = query.q;
		if (query.textId) params.textId = query.textId;
		if (query.sort) params.sort = query.sort;
		if (query.tab && query.tab !== "all") params.tab = query.tab;
		params.page = query.page ?? 1;
		params.limit = query.limit ?? 20;

		const { data } = await http.get<UnknownWordsListResponse>(
			"/admin/unknown-words",
			{ params },
		);
		return data;
	},

	stats: async (): Promise<UnknownWordsStats> => {
		const { data } = await http.get<UnknownWordsStats>(
			"/admin/unknown-words/stats",
		);
		return data;
	},

	getById: async (id: string): Promise<UnknownWordListItem> => {
		const { data } = await http.get<UnknownWordListItem>(
			`/admin/unknown-words/${id}`,
		);
		return data;
	},

	getContexts: async (id: string): Promise<UnknownWordContextsResponse> => {
		const { data } = await http.get<UnknownWordContextsResponse>(
			`/admin/unknown-words/${id}/contexts`,
		);
		return data;
	},

	addToDictionary: async (
		id: string,
		payload: AddToDictionaryPayload,
	): Promise<{ lemma: unknown; resolvedUnknownWordId: string }> => {
		const { data } = await http.post(
			`/admin/unknown-words/${id}/add-to-dictionary`,
			payload,
		);
		return data;
	},

	linkToLemma: async (
		id: string,
		payload: LinkToLemmaPayload,
	): Promise<{ lemmaId: string; resolvedUnknownWordId: string }> => {
		const { data } = await http.post(
			`/admin/unknown-words/${id}/link`,
			payload,
		);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/admin/unknown-words/${id}`);
	},

	clearAll: async (): Promise<ClearAllResponse> => {
		const { data } = await http.delete<ClearAllResponse>(
			"/admin/unknown-words",
		);
		return data;
	},

	bulkDelete: async (ids: string[]): Promise<BulkDeleteResponse> => {
		const { data } = await http.post<BulkDeleteResponse>(
			"/admin/unknown-words/bulk/delete",
			{ ids },
		);
		return data;
	},

	export: async (format: "json" | "csv" = "csv"): Promise<Blob> => {
		const { data } = await http.get<Blob>("/admin/unknown-words/export", {
			params: { format },
			responseType: "blob",
		});
		return data;
	},
};
