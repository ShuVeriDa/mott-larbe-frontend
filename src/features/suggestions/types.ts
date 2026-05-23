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

export interface Suggestion {
	id: string;
	userId: string;
	entryId: string;
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
	entry?: SuggestionEntry;
	createdAt: string;
}

export interface AdjacentSuggestion {
	id: string;
	entry: { word: string };
}

export interface AdjacentSuggestions {
	prev: AdjacentSuggestion | null;
	next: AdjacentSuggestion | null;
}

export interface CreateSuggestionDto {
	normalized: string;
	rawWord: string;
	currentTranslation: string;
	field: string;
	newValue: string;
	comment?: string;
}

export interface ReviewSuggestionDto {
	decision: ReviewDecision;
	comment?: string;
}

export interface GetSuggestionsParams {
	status?: SuggestionStatus;
	order?: "asc" | "desc";
	q?: string;
	limit?: number;
	offset?: number;
}

export interface GetMySuggestionsParams {
	status?: SuggestionStatus;
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
