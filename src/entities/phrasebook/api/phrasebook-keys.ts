import type { PhrasesQuery } from "./types";

export const phrasebookKeys = {
	root: ["phrasebook"] as const,
	stats: () => ["phrasebook", "stats"] as const,
	categories: () => ["phrasebook", "categories"] as const,
	phrases: (query: PhrasesQuery) => ["phrasebook", "phrases", query] as const,
};
