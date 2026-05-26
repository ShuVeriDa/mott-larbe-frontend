import type { AdminPhrasesQuery } from "./admin-types";

export const adminPhrasebookKeys = {
	all: ["admin", "phrasebook"] as const,
	categories: () => [...adminPhrasebookKeys.all, "categories"] as const,
	phrases: (query: AdminPhrasesQuery) => [...adminPhrasebookKeys.all, "phrases", query] as const,
	suggestions: () => [...adminPhrasebookKeys.all, "suggestions"] as const,
};
