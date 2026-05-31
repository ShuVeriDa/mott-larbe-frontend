export const displayValue = (raw: string | null | undefined): string => {
	if (raw == null || raw === "") return "—";
	try {
		const parsed = JSON.parse(raw);
		return typeof parsed === "string" ? parsed : JSON.stringify(parsed);
	} catch {
		return raw;
	}
};
