import type { GetLibraryTextsQuery } from "./types";

export const libraryTextKeys = {
	root: ["library-text"] as const,
	list: (query: GetLibraryTextsQuery) =>
		["library-text", "list", query] as const,
	infinite: (query: Omit<GetLibraryTextsQuery, "page">) =>
		["library-text", "infinite", query] as const,
	tags: () => ["library-text", "tags"] as const,
	detail: (id: string) => ["library-text", "detail", id] as const,
	related: (id: string) => ["library-text", "related", id] as const,
};
