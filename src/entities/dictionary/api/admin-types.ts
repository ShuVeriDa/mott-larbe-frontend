export type AdminDictionaryTab = "all" | "no_senses" | "no_examples" | "no_forms";
export type AdminDictionarySort =
	| "alpha"
	| "frequency_desc"
	| "newest"
	| "oldest"
	| "no_senses";

export interface AdminDictionaryEntry {
	id: string;
	baseForm: string;
	partOfSpeech: string | null;
	frequency: number | null;
	level: string | null;
	sensesCount: number;
	formsCount: number;
	examplesCount: number;
	createdAt: string;
	language: string;
}

export interface AdminDictionaryListResponse {
	items: AdminDictionaryEntry[];
	total: number;
	page: number;
	limit: number;
}

export interface AdminDictionaryStats {
	totalEntries: number;
	totalLemmas: number;
	totalSenses: number;
	totalForms: number;
	withoutSenses: number;
	unknownWords: number;
}

export interface AdminDictionaryListQuery {
	q?: string;
	pos?: string;
	level?: string;
	sort?: AdminDictionarySort;
	tab?: AdminDictionaryTab;
	page?: number;
	limit?: number;
}

export interface AdminCreateEntryDto {
	word: string;
	normalized: string;
	language: string;
	partOfSpeech?: string;
	translation: string;
	level?: string;
	notes?: string;
	forms?: string[];
	domain?: string;
}

export interface AdminUpdateEntryDto {
	baseForm?: string;
	partOfSpeech?: string | null;
	translation?: string;
	level?: string | null;
	notes?: string;
	forms?: string[];
}
