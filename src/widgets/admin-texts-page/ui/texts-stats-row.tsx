"use client";

import type { AdminTextsStats } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

interface TextsStatsRowProps {
	stats: AdminTextsStats | undefined;
	isLoading: boolean;
}

export const TextsStatsRow = ({ stats, isLoading }: TextsStatsRowProps) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="mb-5 grid grid-cols-5 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2 [&>:last-child]:max-sm:col-span-full">
				{Array.from({ length: 5 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-5 grid grid-cols-5 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2 [&>:last-child]:max-sm:col-span-full">
			<AdminStatCard
				label={t("admin.texts.stats.total")}
				value={stats.totalCount}
				sub={t("admin.texts.stats.totalSub", {
					count: stats.totalGrowthPerMonth,
				})}
			/>
			<AdminStatCard
				label={t("admin.texts.stats.published")}
				value={stats.publishedCount}
				sub={t("admin.texts.stats.publishedSub", {
					percent: Math.round(stats.publishedPercent),
				})}
				valueClassName="text-grn"
			/>
			<AdminStatCard
				label={t("admin.texts.stats.drafts")}
				value={stats.draftCount}
				sub={t("admin.texts.stats.draftsSub")}
				valueClassName="text-amb"
			/>
			<AdminStatCard
				label={t("admin.texts.stats.processing")}
				value={stats.processingCount}
				sub={t("admin.texts.stats.processingSub")}
				valueClassName="text-acc"
			/>
			<AdminStatCard
				label={t("admin.texts.stats.errors")}
				value={stats.errorCount}
				sub={t("admin.texts.stats.errorsSub")}
				valueClassName="text-red"
			/>
		</div>
	);
};
