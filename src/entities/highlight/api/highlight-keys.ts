export const highlightKeys = {
	root: ["highlights"] as const,
	page: (textId: string, pageNumber: number) =>
		["highlights", "page", textId, pageNumber] as const,
};
