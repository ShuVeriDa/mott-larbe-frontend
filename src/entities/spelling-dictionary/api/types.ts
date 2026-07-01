export type SpellingMatchType = "substring" | "whole_word" | "prefix" | "suffix";

export interface SpellingEntry {
	id: string;
	wrongForm: string;
	correctForm: string;
	correctForms: string[];
	matchType: SpellingMatchType;
	comment: string | null;
}

export interface AdminSpellingEntry extends SpellingEntry {
	createdAt: string;
	updatedAt: string;
	createdBy: { id: string; username: string } | null;
}

export interface PaginatedSpellingEntries {
	items: AdminSpellingEntry[];
	total: number;
	page: number;
	limit: number;
}

export interface CreateSpellingEntryPayload {
	wrongForm: string;
	correctForm: string;
	correctForms?: string[];
	matchType?: SpellingMatchType;
	comment?: string;
}

export interface UpdateSpellingEntryPayload {
	wrongForm?: string;
	correctForm?: string;
	correctForms?: string[];
	matchType?: SpellingMatchType;
	comment?: string;
}

export interface FetchSpellingEntriesParams {
	page?: number;
	limit?: number;
	search?: string;
}
