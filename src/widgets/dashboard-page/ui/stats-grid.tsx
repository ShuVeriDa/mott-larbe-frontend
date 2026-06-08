"use client";
import type { DashboardStats } from "@/entities/dashboard";
import { useI18n } from "@/shared/lib/i18n";
import { getStatsConfig } from "../lib/stats-config";
import { ReviewStatCard } from "./review-stat-card";
import { StatCard } from "./stat-card";
import { WordsStatCard } from "./words-stat-card";

interface StatsGridProps {
	stats: DashboardStats;
	lang: string;
	showReviewReminder: boolean;
	dailyWordsGoal: number | null;
}

export const StatsGrid = ({
	stats,
	lang,
	showReviewReminder,
	dailyWordsGoal,
}: StatsGridProps) => {
	const { t } = useI18n();
	const statsConfig = getStatsConfig(stats);

	return (
		<div className="grid grid-cols-4 gap-2 max-md:grid-cols-2 max-sm:gap-[7px] max-[380px]:grid-cols-1">
			{statsConfig.map(item => (
				<StatCard
					key={item.key}
					value={item.value}
					label={t(item.labelKey)}
					iconBgClass={item.iconBgClass}
					icon={item.icon}
				/>
			))}
			<WordsStatCard
				wordsInDictionary={stats.wordsInDictionary}
				wordsAddedToday={stats.wordsAddedToday}
				dailyWordsGoal={dailyWordsGoal}
			/>
			{showReviewReminder && (
				<ReviewStatCard dueToday={stats.dueToday} lang={lang} />
			)}
		</div>
	);
};
