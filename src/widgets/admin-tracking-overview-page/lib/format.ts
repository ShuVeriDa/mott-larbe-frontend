import type { AnalyticsGranularity, AnalyticsRange } from "@/features/admin-analytics";

export const formatNumber = (n: number): string => {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 10_000) return `${Math.round(n / 1_000)}K`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
	return n.toLocaleString("ru-RU");
};

export const formatDuration = (sec: number): string => {
	if (sec <= 0) return "0с";
	const m = Math.floor(sec / 60);
	const s = sec % 60;
	if (m === 0) return `${s}с`;
	if (s === 0) return `${m}м`;
	return `${m}м ${s}с`;
};

export const formatPercent = (v: number): string => `${(v * 100).toFixed(1)}%`;

export const computeDelta = (
	current: number,
	previous: number,
): { pct: number; sign: 1 | -1 | 0 } | null => {
	if (previous === 0) return null;
	const pct = ((current - previous) / previous) * 100;
	const sign = pct > 0 ? 1 : pct < 0 ? -1 : 0;
	return { pct: Math.abs(pct), sign: sign as 1 | -1 | 0 };
};

export const granularityForRange = (range: AnalyticsRange): AnalyticsGranularity => {
	const from = new Date(range.from);
	const to = new Date(range.to);
	const days = Math.round((to.getTime() - from.getTime()) / 86_400_000);
	if (days <= 14) return "day";
	if (days <= 90) return "week";
	return "month";
};
