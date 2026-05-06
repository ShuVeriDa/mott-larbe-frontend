export const formatShortDate = (isoDate: string): string => {
	try {
		return new Date(isoDate).toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "short",
		});
	} catch {
		return "—";
	}
};

export const formatRelativeDate = (isoDate: string): string => {
	const date = new Date(isoDate);
	const now = new Date();
	const diffDays = Math.floor(
		(now.getTime() - date.getTime()) / 86_400_000,
	);

	if (diffDays === 0) return "сегодня";
	if (diffDays === 1) return "вчера";
	if (diffDays < 30) return `${diffDays} д. назад`;

	return date.toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
		year: diffDays > 365 ? "numeric" : undefined,
	});
};

export const formatAbsoluteDate = (isoDate: string): string =>
	new Date(isoDate).toLocaleString("ru-RU", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
