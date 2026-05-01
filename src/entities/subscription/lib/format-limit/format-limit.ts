export const UNLIMITED_SYMBOL = "∞";

export const formatLimit = (value: number | null | undefined): string => {
	if (value === undefined || value === null) return UNLIMITED_SYMBOL;
	if (value < 0) return UNLIMITED_SYMBOL;
	if (value >= 10000) return `${Math.round(value / 1000)}к`;
	if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}к`;
	return String(value);
};

export const isUnlimited = (value: number | null | undefined): boolean =>
	value === undefined || value === null || value < 0;
