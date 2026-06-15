"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { TextVersionListItem } from "@/entities/admin-text";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

interface VersionsStatsRowProps {
	total: number;
	successCount: number;
	errorCount: number;
	currentVersion: TextVersionListItem | null;
	isLoading: boolean;
}

export const VersionsStatsRow = ({ total, successCount, errorCount, currentVersion, isLoading }: VersionsStatsRowProps) => {
	const { t } = useI18n();

	if (isLoading) {
		return (
			<div className="mb-5 grid grid-cols-4 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-5 grid grid-cols-4 gap-2.5 max-sm:grid-cols-2 max-sm:gap-2">
			<AdminStatCard
				label={t("admin.texts.versions.stats.total")}
				sub={t("admin.texts.versions.stats.totalSub")}
				value={total}
			/>
			<AdminStatCard
				label={t("admin.texts.versions.stats.completed")}
				sub={t("admin.texts.versions.stats.completedSub")}
				value={successCount}
				valueClassName="text-grn"
			/>
			<AdminStatCard
				label={t("admin.texts.versions.stats.errors")}
				sub={t("admin.texts.versions.stats.errorsSub")}
				value={errorCount}
				valueClassName={cn(errorCount > 0 && "text-red")}
			/>
			<AdminStatCard
				label={t("admin.texts.versions.stats.currentTokens")}
				sub={t("admin.texts.versions.stats.currentTokensSub", {
					pages: String(currentVersion?.pageCount ?? "—"),
				})}
				value={currentVersion ? currentVersion.tokenCount.toLocaleString() : "—"}
			/>
		</div>
	);
};
