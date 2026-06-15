import type { FetchSpellingEntriesParams } from "./types";

export const spellingDictionaryKeys = {
	root: ["spelling-dictionary"] as const,
	all: () => ["spelling-dictionary", "all"] as const,
	adminRoot: ["admin", "spelling-dictionary"] as const,
	adminList: (params: FetchSpellingEntriesParams) =>
		["admin", "spelling-dictionary", "list", params] as const,
};
