"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { UnknownWordStats } from "@/entities/admin-unknown-word";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

interface UnknownWordsStatsRowProps {
	stats: UnknownWordStats | undefined;
	isLoading: boolean;
}

export const UnknownWordsStatsRow = ({
	stats,
	isLoading,
}: UnknownWordsStatsRowProps) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="mb-3.5 grid grid-cols-4 gap-2 max-sm:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-3.5 grid grid-cols-4 gap-2 max-sm:grid-cols-2">
			<AdminStatCard
				label={t("admin.unknownWords.stats.totalPending")}
				value={stats.totalPending.toLocaleString("ru-RU")}
				sub={t("admin.unknownWords.stats.totalPendingSub")}
				valueClassName="text-amb"
			/>
			<AdminStatCard
				label={t("admin.unknownWords.stats.addedToDictionary")}
				value={stats.totalAddedToDictionary.toLocaleString("ru-RU")}
				sub={t("admin.unknownWords.stats.addedToDictionarySub")}
			/>
			<AdminStatCard
				label={t("admin.unknownWords.stats.encounteredToday")}
				value={stats.encounteredToday.toLocaleString("ru-RU")}
				sub={t("admin.unknownWords.stats.encounteredTodaySub", {
					count: stats.textsToday,
				})}
			/>
			<AdminStatCard
				label={t("admin.unknownWords.stats.deleted")}
				value={stats.totalDeleted.toLocaleString("ru-RU")}
				sub={t("admin.unknownWords.stats.deletedSub")}
			/>
		</div>
	);
};
