export const deckKeys = {
	root: ["deck"] as const,
	stats: () => ["deck", "stats"] as const,
	due: () => ["deck", "due"] as const,
};
