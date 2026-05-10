export const noteKeys = {
	root: ["notes"] as const,
	page: (textId: string, pageNumber: number) =>
		["notes", "page", textId, pageNumber] as const,
};
