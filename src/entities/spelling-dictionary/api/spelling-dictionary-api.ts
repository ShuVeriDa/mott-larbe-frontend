import { http } from "@/shared/api";
import type {
	AdminSpellingEntry,
	CreateSpellingEntryPayload,
	FetchAllSpellingEntriesParams,
	FetchSpellingEntriesParams,
	FetchSpellingOccurrencesParams,
	FetchSpellingOccurrenceTextsParams,
	FindReplaceOccurrencesParams,
	FindReplaceTextsParams,
	FixOccurrencesPayload,
	FixOccurrencesResult,
	PaginatedSpellingEntries,
	PaginatedSpellingOccurrences,
	SpellingEntry,
	SpellingOccurrenceTextOption,
	UpdateSpellingEntryPayload,
} from "./types";

const joinTextIds = (textIds?: string[]): string | undefined =>
	textIds?.length ? textIds.join(",") : undefined;

export const spellingDictionaryApi = {
	getAll: async (params?: FetchAllSpellingEntriesParams): Promise<SpellingEntry[]> => {
		const { data } = await http.get<SpellingEntry[]>("/spelling-dictionary/all", { params });
		return data;
	},

	adminList: async (params: FetchSpellingEntriesParams): Promise<PaginatedSpellingEntries> => {
		const { data } = await http.get<PaginatedSpellingEntries>(
			"/admin/spelling-dictionary",
			{ params },
		);
		return data;
	},

	create: async (payload: CreateSpellingEntryPayload): Promise<AdminSpellingEntry> => {
		const { data } = await http.post<AdminSpellingEntry>(
			"/admin/spelling-dictionary",
			payload,
		);
		return data;
	},

	update: async (id: string, payload: UpdateSpellingEntryPayload): Promise<AdminSpellingEntry> => {
		const { data } = await http.patch<AdminSpellingEntry>(
			`/admin/spelling-dictionary/${id}`,
			payload,
		);
		return data;
	},

	delete: async (id: string): Promise<{ deleted: boolean; id: string }> => {
		const { data } = await http.delete<{ deleted: boolean; id: string }>(
			`/admin/spelling-dictionary/${id}`,
		);
		return data;
	},

	getOccurrences: async (
		id: string,
		params: FetchSpellingOccurrencesParams,
	): Promise<PaginatedSpellingOccurrences> => {
		const { data } = await http.get<PaginatedSpellingOccurrences>(
			`/admin/spelling-dictionary/${id}/occurrences`,
			{ params: { ...params, textIds: joinTextIds(params.textIds) } },
		);
		return data;
	},

	getOccurrenceTexts: async (
		id: string,
		params: FetchSpellingOccurrenceTextsParams,
	): Promise<SpellingOccurrenceTextOption[]> => {
		const { data } = await http.get<SpellingOccurrenceTextOption[]>(
			`/admin/spelling-dictionary/${id}/occurrence-texts`,
			{ params },
		);
		return data;
	},

	fixOccurrences: async (payload: FixOccurrencesPayload): Promise<FixOccurrencesResult> => {
		const { data } = await http.patch<FixOccurrencesResult>(
			"/admin/tokens/bulk",
			payload,
		);
		return data;
	},

	findReplaceOccurrences: async (
		params: FindReplaceOccurrencesParams,
	): Promise<PaginatedSpellingOccurrences> => {
		const { data } = await http.get<PaginatedSpellingOccurrences>(
			"/admin/spelling-dictionary/find-replace/occurrences",
			{ params: { ...params, textIds: joinTextIds(params.textIds) } },
		);
		return data;
	},

	findReplaceTexts: async (
		params: FindReplaceTextsParams,
	): Promise<SpellingOccurrenceTextOption[]> => {
		const { data } = await http.get<SpellingOccurrenceTextOption[]>(
			"/admin/spelling-dictionary/find-replace/texts",
			{ params },
		);
		return data;
	},
};
