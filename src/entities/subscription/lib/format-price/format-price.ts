const CURRENCY_SYMBOLS: Record<string, string> = {
	RUB: "₽",
	USD: "$",
	EUR: "€",
};

export const formatPrice = (
	priceCents: number,
	currency = "RUB",
	locale = "ru",
): string => {
	const major = priceCents / 100;
	const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()] ?? currency;
	const formatted = new Intl.NumberFormat(locale, {
		maximumFractionDigits: major % 1 === 0 ? 0 : 2,
	}).format(major);
	return `${formatted} ${symbol}`;
};

export const formatYearlyMonthlyPrice = (
	yearlyPriceCents: number,
	currency = "RUB",
	locale = "ru",
): string => formatPrice(Math.round(yearlyPriceCents / 12), currency, locale);
