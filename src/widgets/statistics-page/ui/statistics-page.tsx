"use client";

import { useState } from "react";
import { useStatistics, type StatsPeriod } from "@/entities/statistics";
import { PeriodTabs } from "@/features/stats-period-tabs";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { AccuracyBlock } from "./accuracy-block";
import { ActivityLog } from "./activity-log";
import { KpiGrid } from "./kpi-grid";
import { PageSkeleton } from "./page-skeleton";
import { StreakBlock } from "./streak-block";
import { TextsProgress } from "./texts-progress";
import { WordProgressCard } from "./word-progress-card";
import { WordsPerDayChart } from "./words-per-day-chart";

export const StatisticsPage = () => {
	const { t, lang } = useI18n();
	const [period, setPeriod] = useState<StatsPeriod>("month");

	const { data, isLoading, isError, refetch } = useStatistics({
		period,
		activityLimit: 15,
	});

	return (
		<>
			<header className="flex shrink-0 items-center gap-3 border-hairline border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-md:flex-wrap max-md:px-4 max-md:py-2.5">
				<Typography
					tag="h1"
					className="text-[13.5px] font-semibold text-t-1"
				>
					{t("statistics.pageTitle")}
				</Typography>
				<div className="ml-auto max-md:w-full">
					<PeriodTabs value={period} onChange={setPeriod} />
				</div>
			</header>

			{isLoading ? (
				<PageSkeleton />
			) : isError || !data ? (
				<div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
					<Typography tag="p" className="text-sm text-red">
						{t("statistics.error")}
					</Typography>
					<button
						type="button"
						onClick={() => refetch()}
						className="rounded-md bg-acc px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
					>
						{t("statistics.retry")}
					</button>
				</div>
			) : (
				<div className="flex flex-col gap-3.5 overflow-y-auto px-[22px] pb-7 pt-4 max-md:px-4 max-md:pb-6 max-md:pt-3.5 max-[480px]:px-3 max-[480px]:pb-5 max-[480px]:pt-3">
					<KpiGrid header={data.header} />

					<StreakBlock streak={data.streak} heatmap={data.heatmap} />

					<div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
						<WordProgressCard words={data.words} />
						<WordsPerDayChart points={data.wordsPerDay} />
					</div>

					<TextsProgress items={data.texts} lang={lang} />

					<div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
						<AccuracyBlock accuracy={data.accuracy} />
						<ActivityLog items={data.recentActivity} />
					</div>
				</div>
			)}
		</>
	);
};
