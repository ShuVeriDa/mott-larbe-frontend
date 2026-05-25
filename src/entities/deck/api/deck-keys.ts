export const deckKeys = {
	root: ["deck"] as const,
	stats: () => ["deck", "stats"] as const,
	due: () => ["deck", "due"] as const,
	settings: () => ["deck", "settings"] as const,
	daily: () => ["deck", "daily"] as const,
};
