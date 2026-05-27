"use client";

import { useStatistics, type StatsPeriod } from "@/entities/statistics";
import { PeriodTabs } from "@/features/stats-period-tabs";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import Link from "next/link";
import { ComponentProps, useState } from "react";
import { AccuracyCard } from "./accuracy-card";
import { AchievementsCard } from "./achievements-card";
import { ActivityLog } from "./activity-log";
import { EventsChart } from "./events-chart";
import { GoalForecastCard } from "./goal-forecast-card";
import { KpiGrid } from "./kpi-grid";
import { PageSkeleton } from "./page-skeleton";
import { PerDayChart } from "./per-day-chart";
import { PhraseStatsCard } from "./phrase-stats-card";
import { ProgressCard } from "./progress-card";
import { ReadingSpeedCard } from "./reading-speed-card";
import { RetentionCard } from "./retention-card";
import { ReviewSessionsCard } from "./review-sessions-card";
import { StreakBlock } from "./streak-block";
import { TextLevelsCard } from "./text-levels-card";
import { TextsProgress } from "./texts-progress";
import { TopWordsCard } from "./top-words-card";
import { VocabularyGrowthChart } from "./vocabulary-growth-chart";
import { WeakSpotsCard } from "./weak-spots-card";
import { WeekdayActivityCard } from "./weekday-activity-card";

const is403 = (err: unknown): boolean => {
	if (!err || typeof err !== "object") return false;
	const e = err as { response?: { status?: number } };
	return e.response?.status === 403;
};

export const StatisticsPage = () => {
	const { t, lang } = useI18n();
	const [period, setPeriod] = useState<StatsPeriod>("month");

	const { data, isLoading, isError, error, refetch } = useStatistics({
		period,
		activityLimit: 15,
	});

	const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () =>
		refetch();

	return (
		<>
			<header className="flex shrink-0 items-center gap-3 border-[0.5px] border-b border-bd-1 bg-surf px-[22px] py-3 transition-colors max-md:flex-wrap max-md:px-4 max-md:py-2.5">
				<Typography tag="h1" className="text-[13.5px] font-semibold text-t-1">
					{t("statistics.pageTitle")}
				</Typography>
				<div className="ml-auto max-md:w-full">
					<PeriodTabs value={period} onChange={setPeriod} />
				</div>
			</header>

			{isLoading ? (
				<PageSkeleton />
			) : is403(error) ? (
				<div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-20 text-center">
					<div className="flex size-12 items-center justify-center rounded-full bg-acc-bg">
						<svg
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							className="size-5 text-acc"
							aria-hidden="true"
						>
							<rect x="4" y="9" width="12" height="9" rx="2" />
							<path d="M7 9V6a3 3 0 1 1 6 0v3" strokeLinecap="round" />
						</svg>
					</div>
					<Typography tag="p" className="text-sm font-semibold text-t-1">
						{t("statistics.premium.title")}
					</Typography>
					<Typography tag="p" className="max-w-[260px] text-xs leading-relaxed text-t-3">
						{t("statistics.premium.description")}
					</Typography>
					<Link
						href={`/${lang}/plans`}
						className="mt-1 rounded-md bg-acc px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
					>
						{t("statistics.premium.upgrade")}
					</Link>
				</div>
			) : isError || !data ? (
				<div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
					<Typography tag="p" className="text-sm text-red">
						{t("statistics.error")}
					</Typography>
					<Button
						onClick={handleClick}
						className="rounded-md bg-acc px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
					>
						{t("statistics.retry")}
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-3.5 overflow-y-auto px-[22px] pb-7 pt-4 max-md:px-4 max-md:pb-6 max-md:pt-3.5 max-[480px]:px-3 max-[480px]:pb-5 max-[480px]:pt-3">

					{/* Row 1: KPI */}
					<KpiGrid header={data.header} sparklines={data.kpiSparklines} />

					{/* Row 2: Streak + heatmap */}
					<StreakBlock streak={data.streak} heatmap={data.heatmap} heatmapWeek={data.heatmapWeek} period={period} />

					{/* Row 3: Achievements */}
					<AchievementsCard data={data.achievements} />

					{/* Row 4: Events + Vocabulary growth */}
					<div className="grid grid-cols-2 gap-3.5 max-md:grid-cols-1">
						<EventsChart chart={data.eventsChart} />
						<VocabularyGrowthChart points={data.vocabularyGrowth} period={period} />
					</div>

					{/* Row 5: Progress + Per day */}
					<div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
						<ProgressCard words={data.words} phrases={data.phraseProgress} />
						<PerDayChart wordsPoints={data.wordsPerDay} phrasesPoints={data.phrasesPerDay} period={period} />
					</div>

					{/* Row 6: Retention + Weekday activity */}
					<div className="grid grid-cols-2 gap-2 max-md:grid-cols-1">
						<RetentionCard data={data.retention} />
						<WeekdayActivityCard data={data.weekdayActivity} />
					</div>

					{/* Row 7: Review sessions + Top words + Weak spots */}
					<div className="grid grid-cols-3 gap-2 max-lg:grid-cols-1">
						<ReviewSessionsCard data={data.reviewSessions} />
						<TopWordsCard data={data.topWords} />
						<WeakSpotsCard data={data.weakSpots} lang={lang} />
					</div>

					{/* Row 8: Texts progress + Reading speed */}
					<div className="grid grid-cols-3 items-stretch gap-2 max-lg:grid-cols-1">
						<div className="col-span-2 h-full max-lg:col-span-1">
							<TextsProgress items={data.texts} lang={lang} />
						</div>
						<ReadingSpeedCard data={data.readingSpeed} />
					</div>

					{/* Row 9a: Accuracy + Phrase stats */}
					<div className="grid grid-cols-2 gap-2 max-sm:grid-cols-1">
						<AccuracyCard accuracy={data.accuracy} phraseAccuracy={data.phraseAccuracy} />
						<PhraseStatsCard />
					</div>

					{/* Row 9b: Text levels + Goal forecast + Activity log */}
					<div className="grid grid-cols-3 gap-2 max-md:grid-cols-2 max-sm:grid-cols-1">
						<TextLevelsCard items={data.texts} />
						<GoalForecastCard data={data.goalForecast} />
						<ActivityLog items={data.recentActivity} />
					</div>
				</div>
			)}
		</>
	);
};
