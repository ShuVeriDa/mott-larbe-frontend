"use client";

import type { MorphRuleStats } from "@/entities/morph-rule";
import { useI18n } from "@/shared/lib/i18n";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";
import { Typography } from "@/shared/ui/typography";

interface Props {
	stats?: MorphRuleStats;
	isLoading?: boolean;
}

export const MorphologyStatsRow = ({ stats, isLoading }: Props) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
			<AdminStatCard
				label={t("admin.morphology.stats.total")}
				value={stats.total.toLocaleString()}
				sub={t("admin.morphology.stats.totalSub")}
			/>
			<AdminStatCard
				label={t("admin.morphology.stats.coverage")}
				value={`${stats.coveragePct}%`}
				valueClassName="text-grn"
				sub={
					<Typography tag="span">
						<Typography
							tag="span"
							className="mr-1 inline-block size-1.5 rounded-full bg-grn align-middle"
						/>
						{t("admin.morphology.stats.coverageSub")}
					</Typography>
				}
			/>
			<AdminStatCard
				label={t("admin.morphology.stats.matches")}
				value={stats.totalMatches.toLocaleString()}
				sub={t("admin.morphology.stats.matchesSub")}
			/>
			<AdminStatCard
				label={t("admin.morphology.stats.inactive")}
				value={stats.inactive}
				valueClassName="text-amb"
				sub={t("admin.morphology.stats.inactiveSub")}
			/>
		</div>
	);
};
