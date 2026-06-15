"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { TokenizationStats } from "@/entities/token";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

interface TokenizationStatsRowProps {
	stats: TokenizationStats | undefined;
}

export const TokenizationStatsRow = ({ stats }: TokenizationStatsRowProps) => {
	const { t } = useI18n();

	if (!stats) {
		return (
			<div className="mb-5 grid grid-cols-5 gap-2.5 max-sm:grid-cols-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-5 grid grid-cols-5 gap-2.5 max-md:grid-cols-3 max-sm:grid-cols-2">
			<AdminStatCard
				label={t("admin.tokenization.stats.total")}
				value={stats.totalTokens.toLocaleString()}
				sub={t("admin.tokenization.stats.totalSub")}
			/>
			<AdminStatCard
				label={t("admin.tokenization.stats.analyzed")}
				value={stats.analyzedCount.toLocaleString()}
				sub={`${stats.analyzedPercent}%`}
				valueClassName="text-grn"
			/>
			<AdminStatCard
				label={t("admin.tokenization.stats.ambiguous")}
				value={stats.ambiguousCount.toLocaleString()}
				sub={`${stats.ambiguousPercent}%`}
				valueClassName="text-amb"
			/>
			<AdminStatCard
				label={t("admin.tokenization.stats.notFound")}
				value={stats.notFoundCount.toLocaleString()}
				sub={`${stats.notFoundPercent}%`}
				valueClassName="text-red"
			/>
			<AdminStatCard
				label={t("admin.tokenization.stats.unprocessed")}
				value={stats.textsWithoutProcessing}
				sub={t("admin.tokenization.stats.unprocessedSub")}
			/>
		</div>
	);
};
