export interface LemmaSearchResult {
	id: string;
	baseForm: string;
	normalized: string;
	partOfSpeech: string | null;
	translation: string | null;
}

export type AnnotateScope = "local" | "global";

export interface AnnotateTokenDto {
	lemmaId: string;
	scope: AnnotateScope;
}

export interface AnnotateTokenResponse {
	success: boolean;
	lemmaBaseForm: string;
}

export interface CreateMorphFormDto {
	normalized: string;
	lemmaId: string;
	translation?: string;
}

export interface CreateMorphFormResponse {
	success: boolean;
	lemmaBaseForm: string;
}

export interface TokenOccurrence {
	tokenId: string;
	word: string;
	before: string;
	after: string;
}

export interface BatchAnnotateDto {
	tokenIds: string[];
	normalized: string;
	lemmaId: string;
	translation?: string;
}

export interface BatchAnnotateResponse {
	success: boolean;
	updatedTokens: number;
	lemmaBaseForm: string;
}

export interface AnnotatedFormOnPage {
	morphFormId: string;
	normalized: string;
	form: string;
	lemmaId: string;
	lemmaBaseForm: string;
	translation: string | null;
}

export interface MorphFormLemma {
	id: string;
	baseForm: string;
	normalized: string;
	partOfSpeech: string | null;
}

export interface MorphFormListItem {
	id: string;
	form: string;
	normalized: string;
	translation: string | null;
	lemma: MorphFormLemma;
}

export interface MorphFormDetail extends MorphFormListItem {
	tokenCount: number;
}

export interface MorphFormListResponse {
	items: MorphFormListItem[];
	total: number;
	page: number;
	limit: number;
}

export interface PatchMorphFormDto {
	translation?: string;
}
