import type { FetchUnknownWordsQuery } from "./types";

export const adminUnknownWordKeys = {
	root: ["admin", "unknown-words"] as const,
	list: (query: FetchUnknownWordsQuery) =>
		["admin", "unknown-words", "list", query] as const,
	stats: () => ["admin", "unknown-words", "stats"] as const,
	contexts: (id: string) =>
		["admin", "unknown-words", id, "contexts"] as const,
	texts: () => ["admin", "texts", "dropdown"] as const,
	lemmas: (q: string) => ["admin", "dictionary", "search", q] as const,
};
