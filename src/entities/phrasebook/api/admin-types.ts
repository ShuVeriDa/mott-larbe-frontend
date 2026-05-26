import type { PhraseLang, PhraseWord, PhraseExample } from "./types";

export interface AdminPhrasebookCategory {
	id: string;
	emoji: string;
	name: string;
	sortOrder: number;
	_count: { phrases: number };
}

export interface AdminPhrasebookPhrase {
	id: string;
	categoryId: string;
	original: string;
	transliteration: string | null;
	translation: string;
	lang: PhraseLang;
	sortOrder: number;
	words: PhraseWord[];
	examples: PhraseExample[];
	_count: { saves: number };
}

export interface AdminPhrasesResponse {
	items: AdminPhrasebookPhrase[];
	total: number;
	page: number;
	limit: number;
}

export interface AdminSuggestionsResponse {
	items: AdminPhrasebookSuggestion[];
	total: number;
	page: number;
	limit: number;
}

export interface AdminPhrasebookSuggestion {
	id: string;
	original: string;
	translation: string;
	lang: PhraseLang;
	context: string | null;
	createdAt: string;
	user: { id: string; username: string; email: string };
	category: { id: string; name: string } | null;
}

export interface CreateAdminCategoryDto {
	emoji: string;
	name: string;
	sortOrder?: number;
}

export type UpdateAdminCategoryDto = Partial<CreateAdminCategoryDto>;

export interface CreateAdminPhraseWordDto {
	original: string;
	translation: string;
	position?: number;
}

export interface CreateAdminPhraseExampleDto {
	phrase: string;
	translation: string;
	context?: string;
}

export interface CreateAdminPhraseDto {
	categoryId: string;
	original: string;
	transliteration?: string;
	translation: string;
	lang: PhraseLang;
	sortOrder?: number;
	words?: CreateAdminPhraseWordDto[];
	examples?: CreateAdminPhraseExampleDto[];
}

export type UpdateAdminPhraseDto = Partial<CreateAdminPhraseDto>;

export interface AdminPhrasesQuery {
	categoryId?: string;
	search?: string;
	page?: number;
	limit?: number;
}
