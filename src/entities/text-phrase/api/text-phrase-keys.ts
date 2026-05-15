import type { TextPhraseListQuery } from "./types";

export const textPhraseKeys = {
	all: ["admin", "text-phrases"] as const,
	list: (query: TextPhraseListQuery) => [...textPhraseKeys.all, "list", query] as const,
	detail: (id: string) => [...textPhraseKeys.all, "detail", id] as const,
};
