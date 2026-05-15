export type TextPhraseLanguage = "CHE" | "RU" | "EN";

export interface TextPhraseListItem {
	id: string;
	original: string;
	normalized: string;
	translation: string;
	language: TextPhraseLanguage;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
	_count: { occurrences: number };
}

export interface TextPhraseOccurrence {
	id: string;
	phraseId: string;
	textId: string;
	pageNumber: number;
	startTokenPosition: number;
	endTokenPosition: number;
	createdAt: string;
	text: {
		id: string;
		title: string;
	};
}

export interface TextPhraseDetail {
	id: string;
	original: string;
	normalized: string;
	translation: string;
	language: TextPhraseLanguage;
	notes: string | null;
	createdAt: string;
	updatedAt: string;
	occurrences: TextPhraseOccurrence[];
}

export interface TextPhraseListResponse {
	items: TextPhraseListItem[];
	total: number;
	page: number;
	limit: number;
}

export interface TextPhraseListQuery {
	language?: TextPhraseLanguage;
	page?: number;
	limit?: number;
	q?: string;
}

export interface CreateTextPhraseDto {
	original: string;
	translation: string;
	language: TextPhraseLanguage;
	notes?: string;
}

export interface PatchTextPhraseDto {
	translation?: string;
	notes?: string;
}
