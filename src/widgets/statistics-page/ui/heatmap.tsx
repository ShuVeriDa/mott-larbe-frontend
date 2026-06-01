"use client";

import type { HeatmapMonth, HeatmapWeekDay, StatsPeriod } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { HeatmapLegend } from "./heatmap-legend";
import { HeatmapMonthGrid } from "./heatmap-month-grid";
import { HeatmapWeek } from "./heatmap-week";
import { HeatmapYear } from "./heatmap-year";

interface HeatmapProps {
	months: HeatmapMonth[];
	weekDays: HeatmapWeekDay[];
	period?: StatsPeriod;
}

export const Heatmap = ({ months, weekDays, period }: HeatmapProps) => {
	const { t } = useI18n();

	const label =
		period === "week"
			? t("statistics.streak.weekActivity")
			: period === "month"
				? t("statistics.streak.monthActivity")
				: period === "all"
					? t("statistics.streak.allActivity")
					: t("statistics.streak.yearActivity");

	const flatMonthDays = period === "month" ? months.flatMap((m) => m.days) : [];

	return (
		<div className="min-w-0 flex-1">
			<div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-t-3">{label}</div>

			{period === "week" && <HeatmapWeek days={weekDays} t={t} />}
			{period === "month" && <HeatmapMonthGrid days={flatMonthDays} t={t} />}
			{(period === "year" || period === "all" || !period) && <HeatmapYear months={months} />}

			<HeatmapLegend t={t} />
		</div>
	);
};
