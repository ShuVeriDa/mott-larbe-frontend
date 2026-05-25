export const readerContextKeys = {
	context: (textId: string, pageNumber: number) =>
		["reader-context", textId, pageNumber] as const,
};
