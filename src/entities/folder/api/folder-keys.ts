export const folderKeys = {
	root: ["folders"] as const,
	list: () => ["folders", "list"] as const,
	summary: () => ["folders", "summary"] as const,
	detail: (id: string) => ["folders", "detail", id] as const,
};
