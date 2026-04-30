export const landingKeys = {
	all: ["landing"] as const,
	wordLookup: (word: string) => ["landing", "word-lookup", word] as const,
};
