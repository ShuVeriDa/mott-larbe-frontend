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

export interface DetailMorphForm {
	form: string;
	grammarTag: string | null;
	translation: string | null;
	gramCase: string | null;
	gramNumber: string | null;
	caseLabel: string | null;
}

export interface DetailSenseExample {
	id: string;
	text: string;
	translation: string | null;
	origin: string | null;
	sourceTextId: string | null;
}

export interface DetailSense {
	id: string;
	definition: string;
	notes: string | null;
	examples: DetailSenseExample[];
}

export interface DetailWordContext {
	id: string;
	snippet: string | null;
	seenAt: string;
	text: { id: string; title: string; level: CefrLevel | null };
}

export type RelationType =
	| "SYNONYM"
	| "ANTONYM"
	| "DERIVED"
	| "RELATED"
	| string;

export interface DetailRelated {
	type: RelationType;
	lemmaId: string;
	baseForm: string;
	transliteration: string | null;
	level: CefrLevel | null;
	translation?: string | null;
}

export interface DetailLemma {
	id: string;
	baseForm: string;
	partOfSpeech: string | null;
	frequency: number | null;
	transliteration: string | null;
	audioUrl: string | null;
	declensionClass: string | null;
	morphForms: DetailMorphForm[];
	wordContexts: DetailWordContext[];
}

export interface DetailSm2Progress {
	status: LearningLevel;
	seenCount: number;
	repetitions: number;
	lastSeen: string | null;
	nextReview: string | null;
	easeFactor: number;
	interval: number;
	targetRepetitions: number;
}

export interface DetailReviewLog {
	id: string;
	quality: number | null;
	correct: boolean;
	intervalBefore: number | null;
	intervalAfter: number | null;
	intervalDelta: number | null;
	createdAt: string;
}

export interface DetailReviewHistory {
	totalReviews: number;
	successCount: number;
	logs: DetailReviewLog[];
}

export interface DictionaryEntryDetail {
	id: string;
	word: string;
	translation: string;
	normalized: string;
	learningLevel: LearningLevel;
	cefrLevel: CefrLevel | null;
	addedAt: string;
	folder: { id: string; name: string; color: string | null } | null;
	lemma: DetailLemma | null;
	senses: DetailSense[];
	related: DetailRelated[];
	sm2: DetailSm2Progress | null;
	progressPercent: number;
	reviewHistory: DetailReviewHistory;
}

export interface DictionaryNeighbor {
	id: string;
	word: string;
}

export interface DictionaryNeighborsResponse {
	prev: DictionaryNeighbor | null;
	next: DictionaryNeighbor | null;
	position: number | null;
	total: number;
}
