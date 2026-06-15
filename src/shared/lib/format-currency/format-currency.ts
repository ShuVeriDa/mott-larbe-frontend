/**
 * Formats cents as compact Russian rubles: "1 234 ₽", "12 тыс. ₽", "1.5 млн ₽"
 */
export const formatCentsRub = (cents: number): string => {
	const rub = cents / 100;
	if (rub >= 1_000_000) return `${(rub / 1_000_000).toFixed(1)} млн ₽`;
	if (rub >= 1_000) return `${Math.round(rub / 1_000)} тыс. ₽`;
	return `${Math.round(rub)} ₽`;
};

/**
 * Formats cents using Intl — full locale currency format: "1 234,00 ₽"
 */
export const formatCentsIntl = (cents: number, currency = "RUB"): string => {
	try {
		return new Intl.NumberFormat("ru-RU", {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(cents / 100);
	} catch {
		return `${Math.round(cents / 100).toLocaleString("ru-RU")} ₽`;
	}
};
