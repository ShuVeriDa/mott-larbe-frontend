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

export interface SpellingOccurrence {
	id: string;
	tokenId: string;
	textId: string;
	textTitle: string;
	pageNumber: number;
	before: string;
	match: string;
	after: string;
}

export interface PaginatedSpellingOccurrences {
	items: SpellingOccurrence[];
	total: number;
	page: number;
	limit: number;
	canBulkFix: boolean;
	entry?: {
		id: string;
		wrongForm: string;
		correctForm: string;
		correctForms: string[];
		matchType: SpellingMatchType;
	};
	appliedMatchType?: SpellingMatchType;
}

export interface SpellingOccurrenceTextOption {
	id: string;
	title: string;
}

export interface FetchSpellingOccurrencesParams {
	page?: number;
	limit?: number;
	textIds?: string[];
	matchType?: SpellingMatchType;
}

export interface FetchSpellingOccurrenceTextsParams {
	search?: string;
}

export interface FixOccurrencesPayload {
	updates: { tokenId: string; original: string }[];
}

export interface FixOccurrencesResult {
	updated: unknown[];
	errors: { tokenId: string; message: string }[];
}

export interface FindReplaceOccurrencesParams extends FetchSpellingOccurrencesParams {
	wrongForm: string;
	matchType: SpellingMatchType;
}

export interface FindReplaceTextsParams extends FetchSpellingOccurrenceTextsParams {
	wrongForm: string;
	matchType: SpellingMatchType;
}
