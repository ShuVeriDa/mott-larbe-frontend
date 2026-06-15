import { http } from "@/shared/api";
import type {
	AdminSpellingEntry,
	CreateSpellingEntryPayload,
	FetchSpellingEntriesParams,
	PaginatedSpellingEntries,
	SpellingEntry,
	UpdateSpellingEntryPayload,
} from "./types";

export const spellingDictionaryApi = {
	getAll: async (): Promise<SpellingEntry[]> => {
		const { data } = await http.get<SpellingEntry[]>("/spelling-dictionary/all");
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
};
