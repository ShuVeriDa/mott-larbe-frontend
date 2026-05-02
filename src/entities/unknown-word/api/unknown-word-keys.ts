import type { FetchUnknownWordsQuery } from "./types";

export const unknownWordKeys = {
	root: ["admin", "unknown-words"] as const,
	list: (query: FetchUnknownWordsQuery) =>
		["admin", "unknown-words", "list", query] as const,
	stats: () => ["admin", "unknown-words", "stats"] as const,
	contexts: (id: string) =>
		["admin", "unknown-words", "contexts", id] as const,
};
