import type { GetLibraryTextsQuery } from "./types";

export const libraryTextKeys = {
	root: ["library-text"] as const,
	list: (query: GetLibraryTextsQuery) =>
		["library-text", "list", query] as const,
	tags: () => ["library-text", "tags"] as const,
};
