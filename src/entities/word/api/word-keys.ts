export const wordKeys = {
	root: ["word"] as const,
	lookup: (tokenId: string) => ["word", "lookup", tokenId] as const,
};
