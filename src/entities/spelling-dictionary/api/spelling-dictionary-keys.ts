import type {
	FetchSpellingEntriesParams,
	FetchSpellingOccurrencesParams,
	FetchSpellingOccurrenceTextsParams,
	FindReplaceOccurrencesParams,
	FindReplaceTextsParams,
} from "./types";

export const spellingDictionaryKeys = {
	root: ["spelling-dictionary"] as const,
	all: () => ["spelling-dictionary", "all"] as const,
	adminRoot: ["admin", "spelling-dictionary"] as const,
	adminList: (params: FetchSpellingEntriesParams) =>
		["admin", "spelling-dictionary", "list", params] as const,
	occurrences: (id: string, params: FetchSpellingOccurrencesParams) =>
		["admin", "spelling-dictionary", id, "occurrences", params] as const,
	occurrenceTexts: (id: string, params: FetchSpellingOccurrenceTextsParams) =>
		["admin", "spelling-dictionary", id, "occurrence-texts", params] as const,
	findReplaceOccurrences: (params: FindReplaceOccurrencesParams) =>
		["admin", "spelling-dictionary", "find-replace", "occurrences", params] as const,
	findReplaceTexts: (params: FindReplaceTextsParams) =>
		["admin", "spelling-dictionary", "find-replace", "texts", params] as const,
};
