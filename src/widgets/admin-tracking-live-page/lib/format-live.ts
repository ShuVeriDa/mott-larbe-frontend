export const formatLiveTime = (iso: string): string => {
	const d = new Date(iso);
	const h = d.getHours().toString().padStart(2, "0");
	const m = d.getMinutes().toString().padStart(2, "0");
	const s = d.getSeconds().toString().padStart(2, "0");
	return `${h}:${m}:${s}`;
};

export const countryCodeToFlag = (code: string | null): string => {
	if (!code || code.length !== 2) return "";
	const base = 0x1f1e6 - 0x41;
	return String.fromCodePoint(base + code.toUpperCase().charCodeAt(0)) +
		String.fromCodePoint(base + code.toUpperCase().charCodeAt(1));
};

export const deviceIcon = (device: string | null): string => {
	if (!device) return "•";
	const d = device.toLowerCase();
	if (d === "mobile" || d === "tablet") return "📱";
	if (d === "bot") return "🤖";
	return "💻";
};

export const eventBadgeClass = (type: string): string => {
	switch (type) {
		case "pageview": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
		case "text_open": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
		case "text_finish": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
		case "word_click": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
		case "word_add_dict": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
		case "ai_translation": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
		case "search": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
		default: return "bg-muted text-muted-foreground";
	}
};
