export type UnknownWordStatus =
	| "PENDING"
	| "ADDED_TO_DICTIONARY"
	| "LINKED_TO_LEMMA"
	| "DELETED";

export type UnknownWordsSortOrder =
	| "frequency_desc"
	| "newest_first"
	| "alphabetical";

export type UnknownWordsTab = "all" | "frequent" | "rare";

export interface UnknownWordListItem {
	id: string;
	word: string;
	normalized: string;
	seenCount: number;
	status: UnknownWordStatus;
	firstSeen: string;
	lastSeen: string;
	lastTextId?: string | null;
	lastTokenId?: string | null;
	texts: Array<{ id: string; title: string }>;
	snippet?: string | null;
}

export interface UnknownWordsStats {
	totalPending: number;
	totalAddedToDictionary: number;
	totalLinkedToLemma: number;
	totalDeleted: number;
	encounteredToday: number;
	textsToday: number;
}

export interface UnknownWordsTabCounts {
	all: number;
	frequent: number;
	rare: number;
}

export interface UnknownWordsListResponse {
	items: UnknownWordListItem[];
	total: number;
	page: number;
	limit: number;
	tabs: UnknownWordsTabCounts;
}

export interface FetchUnknownWordsQuery {
	q?: string;
	textId?: string;
	sort?: UnknownWordsSortOrder;
	tab?: UnknownWordsTab;
	page?: number;
	limit?: number;
}

export interface AddToDictionaryPayload {
	language: "CHE" | "RU";
	translation: string;
	headword?: string;
	partOfSpeech?: string;
	level?: string;
	notes?: string;
	forms?: string[];
	domain?: string;
}

export interface LinkToLemmaPayload {
	lemmaId: string;
}

export interface UnknownWordContext {
	tokenId: string;
	original: string;
	position: number;
	snippet: string;
	textId: string;
	textTitle: string;
	pageNumber?: number | null;
}

export interface UnknownWordContextsResponse {
	unknownWord: UnknownWordListItem;
	total: number;
	contexts: UnknownWordContext[];
}

export interface ClearAllResponse {
	deleted: number;
}

export interface BulkDeleteResponse {
	deleted: number;
}
