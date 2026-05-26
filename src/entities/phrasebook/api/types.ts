export type PhraseLang = "che" | "ru" | "ar" | "en";

export interface PhraseWord {
	id: string;
	original: string;
	translation: string;
	position: number;
}

export interface PhraseExample {
	id: string;
	phrase: string;
	translation: string;
	context: string;
}

export interface Phrase {
	id: string;
	original: string;
	transliteration: string | null;
	translation: string;
	lang: PhraseLang;
	saved: boolean;
	words: PhraseWord[];
	examples: PhraseExample[];
}

export interface PhrasebookCategory {
	id: string;
	emoji: string;
	name: string;
	sortOrder: number;
	count: number;
}

export interface PhrasebookStats {
	totalPhrases: number;
	totalCategories: number;
	savedCount: number;
}

export interface PhrasebookSaveResponse {
	saved: boolean;
}

export interface SuggestPhraseDto {
	original: string;
	translation: string;
	lang: PhraseLang;
	context?: string;
	categoryId?: string;
}

export interface SuggestPhraseResponse {
	id: string;
}

export interface PhrasesQuery {
	categoryId?: string;
	lang?: PhraseLang;
	saved?: true;
	search?: string;
}
