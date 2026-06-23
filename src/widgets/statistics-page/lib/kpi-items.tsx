import type { KpiSparklines, StatsHeader } from "@/entities/statistics";
import type { KpiCardProps } from "../ui/kpi-card";
import { AlignLeft, BookOpen, Clock, RefreshCw } from "lucide-react";

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
		icon: <AlignLeft className="size-[13px]" />,
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
		icon: <Clock className="size-[13px]" />,
	},
	{
		label: t("statistics.kpi.reviews"),
		value: header.reviews.total.toLocaleString(),
		delta: header.reviews,
		tone: "amb",
		sparkline: sparklines.reviews,
		icon: <RefreshCw className="size-[13px]" />,
	},
	{
		label: t("statistics.kpi.texts"),
		value: header.textsRead.total.toLocaleString(),
		delta: header.textsRead,
		tone: "pur",
		sparkline: sparklines.textsRead,
		icon: <BookOpen className="size-[13px]" />,
	},
];
