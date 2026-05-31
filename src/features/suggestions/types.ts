export type SuggestionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ReviewDecision = "approve" | "reject";

export interface SuggestionUser {
	id: string;
	username: string;
	name: string;
}

export interface SuggestionEntry {
	id: string;
	rawWord: string;
}

export interface SuggestionText {
	id: string;
	title: string;
}

export interface Suggestion {
	id: string;
	userId: string;
	entryId: string | null;
	textId: string | null;
	field: string;
	oldValue: string | null;
	newValue: string;
	comment?: string;
	status: SuggestionStatus;
	reviewedBy?: string;
	reviewedAt?: string;
	reviewComment?: string;
	user?: SuggestionUser;
	reviewer?: SuggestionUser;
	entry?: SuggestionEntry | null;
	text?: SuggestionText | null;
	createdAt: string;
}

export interface AdjacentSuggestion {
	id: string;
	label: string | null;
}

export interface AdjacentSuggestions {
	prev: AdjacentSuggestion | null;
	next: AdjacentSuggestion | null;
}

export interface CreateSuggestionDto {
	// entry path (existing)
	normalized?: string;
	rawWord?: string;
	currentTranslation?: string;
	entryId?: string;
	// text path (new)
	textId?: string;
	// shared
	field: string;
	newValue: string;
	comment?: string;
}

export type SuggestionType = "entry" | "text";

export interface ReviewSuggestionDto {
	decision: ReviewDecision;
	comment?: string;
}

export interface GetSuggestionsParams {
	status?: SuggestionStatus;
	type?: SuggestionType;
	order?: "asc" | "desc";
	q?: string;
	limit?: number;
	offset?: number;
}

export interface GetMySuggestionsParams {
	status?: SuggestionStatus;
	order?: "asc" | "desc";
	limit?: number;
	offset?: number;
}

export interface SuggestionsListMeta {
	total: number;
	limit: number;
	offset: number;
}

export interface SuggestionsListResponse {
	data: Suggestion[];
	meta: SuggestionsListMeta;
}

export interface SuggestionStats {
	total: number;
	pending: number;
	approved: number;
	rejected: number;
}
