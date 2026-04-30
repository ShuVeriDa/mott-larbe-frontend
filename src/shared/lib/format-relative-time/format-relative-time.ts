type Translator = (key: string, vars?: Record<string, string | number>) => string;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

const startOfDay = (date: Date): Date => {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
};

const formatTime = (date: Date, locale: string) =>
	date.toLocaleTimeString(locale === "che" ? "ru" : locale, {
		hour: "2-digit",
		minute: "2-digit",
	});

const formatDate = (date: Date, locale: string) =>
	date.toLocaleDateString(locale === "che" ? "ru" : locale, {
		day: "numeric",
		month: "long",
	});

export const formatRelativeFromNow = (
	iso: string | null | undefined,
	t: Translator,
): string => {
	if (!iso) return t("time.now");
	const target = new Date(iso).getTime();
	const now = Date.now();
	const diff = Math.abs(now - target);

	if (diff < MINUTE) return t("time.now");
	if (diff < HOUR) return t("time.minutes", { n: Math.round(diff / MINUTE) });
	if (diff < DAY) return t("time.hours", { n: Math.round(diff / HOUR) });
	if (diff < WEEK) return t("time.days", { n: Math.round(diff / DAY) });
	return t("time.weeks", { n: Math.round(diff / WEEK) });
};

export const formatNextReview = (
	iso: string | null | undefined,
	t: Translator,
	locale: string,
): string => {
	if (!iso) return t("vocabulary.review.notScheduled");
	const target = new Date(iso);
	const todayStart = startOfDay(new Date());
	const targetStart = startOfDay(target);
	const dayDiff = Math.round(
		(targetStart.getTime() - todayStart.getTime()) / DAY,
	);

	if (dayDiff === 0) return t("time.todayAt", { time: formatTime(target, locale) });
	if (dayDiff === 1) return t("time.tomorrowAt", { time: formatTime(target, locale) });
	if (dayDiff === -1) return t("time.yesterday");
	if (dayDiff < 0) return t("time.daysAgo", { n: -dayDiff });
	return formatDate(target, locale);
};

export const formatReviewIn = (
	iso: string | null | undefined,
	t: Translator,
): string => {
	if (!iso) return t("vocabulary.review.notScheduled");
	const target = new Date(iso).getTime();
	const diff = target - Date.now();
	if (diff <= 0) return t("vocabulary.review.noNext");
	if (diff < HOUR) return t("time.minutes", { n: Math.max(1, Math.round(diff / MINUTE)) });
	if (diff < DAY) return t("time.hours", { n: Math.round(diff / HOUR) });
	if (diff < WEEK) return t("time.days", { n: Math.round(diff / DAY) });
	return t("time.weeks", { n: Math.round(diff / WEEK) });
};
