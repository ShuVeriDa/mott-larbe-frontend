export const textKeys = {
	root: ["text"] as const,
	page: (textId: string, pageNumber: number) =>
		["text", "page", textId, pageNumber] as const,
	progress: (textId: string) => ["text", "progress", textId] as const,
	bookmark: (textId: string) => ["text", "bookmark", textId] as const,
};
