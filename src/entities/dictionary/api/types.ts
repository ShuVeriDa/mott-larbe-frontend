import type { CefrLevel, LearningLevel } from "@/shared/types";

export interface MorphForm {
	form: string;
	grammarTag: string | null;
}

export interface SenseExample {
	text: string;
	translation: string;
}

export interface Sense {
	definition: string | null;
	examples: SenseExample[];
}

export interface HeadwordEntry {
	senses: Sense[];
}

export interface Headword {
	entry: HeadwordEntry;
}

export interface WordContext {
	textId: string;
	snippet: string | null;
	text: { title: string };
}

export interface Lemma {
	id: string;
	baseForm: string;
	partOfSpeech: string | null;
	morphForms: MorphForm[];
	headwords: Headword[];
	wordContexts: WordContext[];
}

export interface DictionaryEntry {
	id: string;
	word: string;
	normalized: string;
	translation: string;
	addedAt: string;
	learningLevel: LearningLevel;
	cefrLevel: CefrLevel | null;
	repetitionCount: number;
	folderId: string | null;
	lemmaId: string;
	nextReview: string | null;
	wordProgressStatus: LearningLevel;
	progressPercent: number;
	folder: { id: string; name: string } | null;
	lemma: Lemma;
}

export interface DictionaryListResponse {
	items: DictionaryEntry[];
	total: number;
	page: number;
	limit: number;
}

export interface DictionaryStats {
	total: number;
	byLevel: Record<LearningLevel, number>;
	totalRepetitions: number;
	dueCount: number;
	masteryPercent: number;
}

export interface DueWord {
	lemmaId: string;
	nextReview: string;
	status: LearningLevel;
	baseForm: string;
	partOfSpeech: string | null;
	dictionaryEntry: {
		id: string;
		word: string;
		translation: string;
		learningLevel: LearningLevel;
		cefrLevel: CefrLevel | null;
		folderId: string | null;
	};
}

export interface DueResponse {
	count: number;
	nextScheduledAt: string | null;
	words: DueWord[];
}

export type DictionarySort = "added" | "alpha" | "review" | "status";

export interface DictionaryListQuery {
	status?: LearningLevel;
	cefrLevel?: CefrLevel;
	folderId?: string;
	noFolder?: boolean;
	sort?: DictionarySort;
	search?: string;
	page?: number;
	limit?: number;
}

export interface CreateDictionaryEntryDto {
	word: string;
	translation: string;
	folderId?: string | null;
	cefrLevel?: CefrLevel | null;
}

export interface UpdateDictionaryEntryDto {
	learningLevel?: LearningLevel;
	cefrLevel?: CefrLevel | null;
	folderId?: string | null;
	repetitionCount?: number;
}
