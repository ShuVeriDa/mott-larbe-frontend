import type { CefrLevel } from "@/shared/types";

export type AdminDictLanguage = "CHE" | "RU";
export type AdminDictGramCase = "NOM" | "GEN" | "DAT" | "ERG" | "INS" | "LOC" | "ALL";
export type AdminDictGramNumber = "SG" | "PL";
export type AdminDictTab = "all" | "no_senses" | "no_examples" | "no_forms";
export type AdminDictSort = "alpha" | "frequency_desc" | "newest" | "oldest" | "no_senses";

export interface AdminDictHeadword {
	id: string;
	text: string;
	normalized: string;
	isPrimary: boolean;
	order: number;
}

export interface AdminDictExample {
	id: string;
	text: string;
	translation: string | null;
}

export interface AdminDictSense {
	id: string;
	order: number;
	definition: string;
	notes: string | null;
	examples: AdminDictExample[];
}

export interface AdminDictMorphForm {
	id: string;
	form: string;
	normalized: string;
	gramCase: AdminDictGramCase | null;
	gramNumber: AdminDictGramNumber | null;
	grammarTag: string | null;
}

export interface AdminDictEntryCard {
	id: string;
	baseForm: string;
	normalized: string;
	language: AdminDictLanguage;
	partOfSpeech: string | null;
	level: CefrLevel | null;
	frequency: number | null;
	createdAt: string;
	updatedAt: string;
	translation: string;
	notes: string | null;
	entryId: string;
	senses: AdminDictSense[];
	forms: AdminDictMorphForm[];
	headwords: AdminDictHeadword[];
}

export interface AdminDictRelatedLemma {
	id: string;
	baseForm: string;
	normalized: string;
	partOfSpeech: string | null;
	level: CefrLevel | null;
	frequency: number | null;
	isCurrent: boolean;
}

export interface AdminDictNavEntry {
	id: string;
	baseForm: string;
	normalized: string;
}

export interface AdminDictFrequencyStats {
	frequency: number;
	maxFrequency: number;
	rank: number;
	totalLemmas: number;
	textsCovered: number;
	totalTexts: number;
	textCoverage: number;
}

export interface AdminDictUserStats {
	totalAdded: number;
	countNew: number;
	countLearning: number;
	countKnown: number;
}

export interface AdminDictContextItem {
	id: string;
	word: string;
	snippet: string;
	textId: string;
	textTitle: string;
	seenAt: string;
}

export interface AdminDictContextsResponse {
	total: number;
	items: AdminDictContextItem[];
}

export interface AdminDictListItem {
	id: string;
	baseForm: string;
	normalized: string;
	language: AdminDictLanguage;
	partOfSpeech: string | null;
	level: CefrLevel | null;
	frequency: number | null;
	translation: string;
	sensesCount: number;
	formsCount: number;
	createdAt: string;
}

export interface AdminDictListResponse {
	items: AdminDictListItem[];
	total: number;
	page: number;
	limit: number;
	tabCounts: Record<AdminDictTab, number>;
}

export interface AdminDictListQuery {
	q?: string;
	language?: AdminDictLanguage;
	pos?: string;
	level?: CefrLevel;
	sort?: AdminDictSort;
	tab?: AdminDictTab;
	page?: number;
	limit?: number;
}

export interface AdminDictStats {
	totalEntries: number;
	totalLemmas: number;
	totalSenses: number;
	totalMorphForms: number;
	entriesWithoutSenses: number;
	unknownWordsCount: number;
}

// DTOs
export interface CreateAdminEntryDto {
	word: string;
	normalized: string;
	language: AdminDictLanguage;
	partOfSpeech?: string;
	translation: string;
	level?: CefrLevel;
	notes?: string;
}

export interface PatchAdminEntryDto {
	baseForm?: string;
	partOfSpeech?: string;
	translation?: string;
	level?: CefrLevel | null;
	frequency?: number | null;
	declensionClass?: string;
	domain?: string | null;
	notes?: string;
}

export interface CreateAdminSenseDto {
	definition: string;
	notes?: string;
	order?: number;
}

export interface UpdateAdminSenseDto {
	definition?: string;
	notes?: string;
	order?: number;
}

export interface CreateAdminExampleDto {
	text: string;
	translation?: string;
}

export interface UpdateAdminExampleDto {
	text?: string;
	translation?: string;
}

export interface CreateAdminHeadwordDto {
	word: string;
	isPrimary?: boolean;
}

export interface CreateAdminMorphFormDto {
	form: string;
	gramCase?: AdminDictGramCase;
	gramNumber?: AdminDictGramNumber;
	grammarTag?: string;
}

export interface UpdateAdminMorphFormDto {
	form?: string;
	gramCase?: AdminDictGramCase;
	gramNumber?: AdminDictGramNumber;
	grammarTag?: string;
}

export interface AddAdminLemmaDto {
	baseForm: string;
	language: AdminDictLanguage;
	partOfSpeech?: string;
	level?: CefrLevel;
	frequency?: number;
	isPrimary?: boolean;
}
