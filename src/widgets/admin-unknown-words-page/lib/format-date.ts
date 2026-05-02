export const formatShortDate = (iso: string): string => {
	try {
		return new Date(iso).toLocaleDateString("ru-RU", {
			day: "numeric",
			month: "short",
		});
	} catch {
		return "—";
	}
};
