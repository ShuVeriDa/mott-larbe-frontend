export type UnknownWordStatus =
	| "PENDING"
	| "ADDED_TO_DICTIONARY"
	| "LINKED_TO_LEMMA"
	| "DELETED";

export type UnknownWordTab = "all" | "frequent" | "rare";
export type UnknownWordSort = "frequency_desc" | "newest_first" | "alphabetical";

// Aliases for widget backward-compat
export type UnknownWordsTab = UnknownWordTab;
export type UnknownWordsSortOrder = UnknownWordSort;

export interface UnknownWordContext {
	tokenId: string;
	original: string;
	position: number;
	snippet: string;
	startOffset?: number;
	endOffset?: number;
	textId: string;
	textTitle: string;
	pageNumber: number;
}

export interface UnknownWordItem {
	id: string;
	word: string;
	normalized: string;
	seenCount: number;
	status: UnknownWordStatus;
	firstSeen: string;
	lastSeen: string;
	lastTokenId: string | null;
	lastTextId: string | null;
	resolvedAt: string | null;
	texts: Array<{ id: string; title: string }>;
	firstContext: UnknownWordContext | null;
}

// Alias for widget backward-compat
export type UnknownWordListItem = UnknownWordItem;

export interface UnknownWordStats {
	totalPending: number;
	totalAddedToDictionary: number;
	totalLinkedToLemma: number;
	totalDeleted: number;
	encounteredToday: number;
	textsToday: number;
}

export interface UnknownWordTabCounts {
	all: number;
	frequent: number;
	rare: number;
}

export interface FetchUnknownWordsQuery {
	q?: string;
	textId?: string;
	sort?: UnknownWordSort;
	tab?: UnknownWordTab;
	page?: number;
	limit?: number;
}

export interface UnknownWordsListResponse {
	items: UnknownWordItem[];
	total: number;
	page: number;
	limit: number;
	tabs: UnknownWordTabCounts;
}

export interface AddToDictionaryDto {
	language: string;
	translation: string;
	headword: string;
	partOfSpeech?: string;
	level?: string;
	notes?: string;
	domain?: string;
	forms?: string[];
}

// Alias for widget backward-compat
export type AddToDictionaryPayload = AddToDictionaryDto;

export interface TextListItem {
	id: string;
	title: string;
}

export interface LemmaSearchItem {
	id: string;
	headword: string;
	translation: string | null;
}

export interface UnknownWordContextsResponse {
	unknownWord: UnknownWordItem;
	total: number;
	contexts: UnknownWordContext[];
}
