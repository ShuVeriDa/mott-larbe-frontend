export enum PhraseLang {
	CHE = "CHE",
	RU = "RU",
	AR = "AR",
	EN = "EN",
}
export type PhraseStatus = "NEW" | "LEARNING" | "KNOWN";
export type PhraseReviewQuality = 0 | 1 | 2 | 3 | 4 | 5;

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
	translationEn: string | null;
	translationAr: string | null;
	translationDe: string | null;
	translationFr: string | null;
	translationTr: string | null;
	lang: PhraseLang;
	audioUrl: string | null;
	saved: boolean;
	words: PhraseWord[];
	examples: PhraseExample[];
}

export interface PhraseDue extends Phrase {
	status: PhraseStatus;
	interval: number;
	repetitions: number;
	nextReview: string | null;
}

export interface PhraseReviewStats {
	dueCount: number;
	savedDueCount: number;
	learningCount: number;
	knownCount: number;
	reviewedToday: number;
	streak: number;
}

export interface PhraseRateResponse {
	userId: string;
	phraseId: string;
	status: PhraseStatus;
	interval: number;
	easeFactor: number;
	repetitions: number;
	nextReview: string;
}

export interface PhraseCategoryProgress {
	id: string;
	emoji: string;
	name: string;
	sortOrder: number;
	phraseCount: number;
	knownCount: number;
	learningCount: number;
	progressPercent: number;
}

export interface PhrasebookCategory {
	id: string;
	emoji: string;
	name: string;
	sortOrder: number;
	phraseCount: number;
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
