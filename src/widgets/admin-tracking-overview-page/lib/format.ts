import type { AnalyticsGranularity, AnalyticsRange } from "@/features/admin-analytics";

export { formatNumber, formatDuration, formatPercent, computeDelta } from "@/shared/lib/format-number";

export const granularityForRange = (range: AnalyticsRange): AnalyticsGranularity => {
	const from = new Date(range.from);
	const to = new Date(range.to);
	const days = Math.round((to.getTime() - from.getTime()) / 86_400_000);
	if (days <= 14) return "day";
	if (days <= 90) return "week";
	return "month";
};
