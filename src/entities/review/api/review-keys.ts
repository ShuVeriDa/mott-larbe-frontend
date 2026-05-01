export const reviewKeys = {
	root: ["review"] as const,
	stats: () => ["review", "stats"] as const,
	due: (limit?: number) => ["review", "due", limit ?? null] as const,
};
