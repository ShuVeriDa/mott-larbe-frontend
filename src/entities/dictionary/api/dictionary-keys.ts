import type { DictionaryListQuery } from "./types";

export const dictionaryKeys = {
	root: ["dictionary"] as const,
	list: (query: DictionaryListQuery) =>
		["dictionary", "list", query] as const,
	stats: () => ["dictionary", "stats"] as const,
	due: () => ["dictionary", "due"] as const,
	detail: (id: string) => ["dictionary", "detail", id] as const,
	neighbors: (id: string, query: DictionaryListQuery) =>
		["dictionary", "neighbors", id, query] as const,
};
