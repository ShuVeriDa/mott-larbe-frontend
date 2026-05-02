import type { FetchTokenizationTextsQuery } from "./types";

export const tokenizationKeys = {
	root: ["admin", "tokenization"] as const,
	stats: () => ["admin", "tokenization", "stats"] as const,
	distribution: () => ["admin", "tokenization", "distribution"] as const,
	settings: () => ["admin", "tokenization", "settings"] as const,
	list: (query: FetchTokenizationTextsQuery) =>
		["admin", "tokenization", "texts", query] as const,
	detail: (textId: string) => ["admin", "tokenization", "texts", textId] as const,
	tokens: (textId: string, params: Record<string, unknown>) =>
		["admin", "tokenization", "texts", textId, "tokens", params] as const,
	queue: () => ["admin", "tokenization", "queue"] as const,
};
