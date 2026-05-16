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
	isAnnotated: boolean;
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

export interface TokenOccurrenceOnPage {
	tokenId: string;
	isAnnotated: boolean;
}

export interface AnnotatedFormOnPage {
	morphFormId: string;
	hasMorphForm: boolean;
	normalized: string;
	form: string;
	lemmaId: string;
	lemmaBaseForm: string;
	translation: string | null;
	/** Occurrences on the current page only — used for editor highlights (no context needed) */
	pageOccurrences: TokenOccurrenceOnPage[];
	/** Occurrences across all pages with before/after context — used for edit dialog */
	allOccurrences: TokenOccurrence[];
	/** Whether this form should appear in the annotations panel (has annotated tokens on this page) */
	inPanel: boolean;
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

export interface UnannotateTokensDto {
	tokenIds: string[];
}

export interface UnannotateTokensResponse {
	success: boolean;
	updatedTokens: number;
}
