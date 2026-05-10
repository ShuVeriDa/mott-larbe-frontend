export const countWordsInRaw = (raw: string): number => {
	if (!raw) return 0;
	return raw.trim().split(/\s+/).filter(Boolean).length;
};
