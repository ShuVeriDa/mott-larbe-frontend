import type { KpiSparklines, StatsHeader } from "@/entities/statistics";
import type { KpiCardProps } from "../ui/kpi-card";

export const formatReadingTime = (
	minutes: number,
	hoursLabel: (n: number) => string,
	minutesLabel: (n: number) => string,
): string => {
	if (minutes < 60) return minutesLabel(minutes);
	const h = Math.floor(minutes / 60);
	return hoursLabel(h);
};

export const buildKpiItems = (
	header: StatsHeader,
	sparklines: KpiSparklines,
	t: (key: string, vars?: Record<string, string | number>) => string,
): KpiCardProps[] => [
	{
		label: t("statistics.kpi.words"),
		value: header.wordsLearned.total.toLocaleString(),
		delta: header.wordsLearned,
		tone: "acc",
		sparkline: sparklines.wordsLearned,
		icon: (
			<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-[13px]">
				<path d="M3 5h10M3 8h7M3 11h5" strokeLinecap="round" />
			</svg>
		),
	},
	{
		label: t("statistics.kpi.reading"),
		value: formatReadingTime(
			header.readingTimeMinutes.total,
			n => t("statistics.kpi.hoursShort", { n }),
			n => t("statistics.kpi.minutesShort", { n }),
		),
		delta: header.readingTimeMinutes,
		tone: "grn",
		sparkline: sparklines.readingTime,
		icon: (
			<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-[13px]">
				<circle cx="8" cy="8" r="5.5" />
				<path d="M8 5v3.5l2 2" strokeLinecap="round" />
			</svg>
		),
	},
	{
		label: t("statistics.kpi.reviews"),
		value: header.reviews.total.toLocaleString(),
		delta: header.reviews,
		tone: "amb",
		sparkline: sparklines.reviews,
		icon: (
			<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-[13px]">
				<path d="M8 3v5l3 2" strokeLinecap="round" />
				<path d="M3.5 5.5A5.5 5.5 0 1 1 3 9" strokeLinecap="round" />
			</svg>
		),
	},
	{
		label: t("statistics.kpi.texts"),
		value: header.textsRead.total.toLocaleString(),
		delta: header.textsRead,
		tone: "pur",
		sparkline: sparklines.textsRead,
		icon: (
			<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-[13px]">
				<path d="M2 3h5v10H2z" />
				<path d="M9 3h5v10H9z" />
			</svg>
		),
	},
];
