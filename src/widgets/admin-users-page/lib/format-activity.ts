export const formatActivity = (isoDate: string): string => {
	const date = new Date(isoDate);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60_000);
	const diffHours = Math.floor(diffMs / 3_600_000);
	const diffDays = Math.floor(diffMs / 86_400_000);

	if (diffMins < 60) return `${diffMins} мин.`;
	if (diffHours < 24) return `${diffHours} ч. назад`;
	if (diffDays === 1) return "вчера";
	if (diffDays < 7) return `${diffDays} д. назад`;

	return date.toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
	});
};
