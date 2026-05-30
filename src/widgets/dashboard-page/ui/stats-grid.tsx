"use client";
import type { DashboardStats } from "@/entities/dashboard";
import { useI18n } from "@/shared/lib/i18n";
import { getStatsConfig } from "../lib/stats-config";
import { ReviewStatCard } from "./review-stat-card";
import { StatCard } from "./stat-card";

interface StatsGridProps {
	stats: DashboardStats;
	lang: string;
}

export const StatsGrid = ({ stats, lang }: StatsGridProps) => {
	const { t } = useI18n();
	const statsConfig = getStatsConfig(stats);

	return (
		<div className="grid grid-cols-4 gap-2 max-md:grid-cols-2 max-sm:gap-[7px]">
			{statsConfig.map(item => (
				<StatCard
					key={item.key}
					value={item.value}
					label={t(item.labelKey)}
					iconBgClass={item.iconBgClass}
					icon={item.icon}
				/>
			))}
			<ReviewStatCard dueToday={stats.dueToday} lang={lang} />
		</div>
	);
};
