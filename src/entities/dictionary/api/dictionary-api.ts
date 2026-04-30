import { http } from "@/shared/api";
import type {
	CreateDictionaryEntryDto,
	DictionaryEntry,
	DictionaryListQuery,
	DictionaryListResponse,
	DictionaryStats,
	DueResponse,
	UpdateDictionaryEntryDto,
} from "./types";

const buildParams = (query: DictionaryListQuery): Record<string, string | number | boolean> => {
	const params: Record<string, string | number | boolean> = {};
	if (query.status) params.status = query.status;
	if (query.cefrLevel) params.cefrLevel = query.cefrLevel;
	if (query.folderId) params.folderId = query.folderId;
	if (query.noFolder) params.noFolder = query.noFolder;
	if (query.sort) params.sort = query.sort;
	if (query.search) params.search = query.search;
	if (query.page) params.page = query.page;
	if (query.limit) params.limit = query.limit;
	return params;
};

export const dictionaryApi = {
	list: async (query: DictionaryListQuery): Promise<DictionaryListResponse> => {
		const { data } = await http.get<DictionaryListResponse>("/dictionary", {
			params: buildParams(query),
		});
		return data;
	},

	stats: async (): Promise<DictionaryStats> => {
		const { data } = await http.get<DictionaryStats>("/dictionary/stats");
		return data;
	},

	due: async (): Promise<DueResponse> => {
		const { data } = await http.get<DueResponse>("/dictionary/due");
		return data;
	},

	create: async (
		body: CreateDictionaryEntryDto,
	): Promise<DictionaryEntry> => {
		const { data } = await http.post<DictionaryEntry>("/dictionary", body);
		return data;
	},

	update: async (
		id: string,
		body: UpdateDictionaryEntryDto,
	): Promise<DictionaryEntry> => {
		const { data } = await http.patch<DictionaryEntry>(
			`/dictionary/${id}`,
			body,
		);
		return data;
	},

	remove: async (id: string): Promise<void> => {
		await http.delete(`/dictionary/${id}`);
	},
};
