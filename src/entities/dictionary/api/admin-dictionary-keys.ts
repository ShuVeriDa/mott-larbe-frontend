import type { AdminDictListQuery } from "./admin-dictionary-types";

export const adminDictionaryKeys = {
	all: ["admin", "dictionary"] as const,
	stats: () => [...adminDictionaryKeys.all, "stats"] as const,
	list: (query: AdminDictListQuery) => [...adminDictionaryKeys.all, "list", query] as const,
	detail: (id: string) => [...adminDictionaryKeys.all, "detail", id] as const,
	relatedLemmas: (id: string) => [...adminDictionaryKeys.all, "relatedLemmas", id] as const,
	frequencyStats: (id: string) => [...adminDictionaryKeys.all, "frequencyStats", id] as const,
	userStats: (id: string) => [...adminDictionaryKeys.all, "userStats", id] as const,
	contexts: (id: string) => [...adminDictionaryKeys.all, "contexts", id] as const,
	nav: (id: string) => [...adminDictionaryKeys.all, "nav", id] as const,
};
