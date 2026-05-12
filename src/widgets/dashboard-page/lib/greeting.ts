export const getGreetingKey = (): string => {
	const h = new Date().getHours();
	if (h < 12) return "dashboard.greeting.morning";
	if (h < 18) return "dashboard.greeting.afternoon";
	return "dashboard.greeting.evening";
};

export const formatGreetingDate = (lang: string): string =>
	new Date().toLocaleDateString(
		lang === "che" || lang === "ru" ? "ru-RU" : "en-US",
		{ weekday: "long", day: "numeric", month: "long" },
	);
