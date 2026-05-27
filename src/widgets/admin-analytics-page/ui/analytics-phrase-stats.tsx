"use client";

import type { PhraseStats } from "@/entities/admin-analytics";
import { useI18n } from "@/shared/lib/i18n";
import { AdminCard, AdminCardHeader } from "@/shared/ui/admin-card";
import { MiniCard } from "@/shared/ui/mini-card";

interface AnalyticsPhraseStatsProps {
	stats?: PhraseStats;
	isLoading?: boolean;
}

export const AnalyticsPhraseStats = ({ stats, isLoading }: AnalyticsPhraseStatsProps) => {
	const { t } = useI18n();

	return (
		<AdminCard>
			<AdminCardHeader
				title={t("admin.analytics.phrases.title")}
				subtitle={t("admin.analytics.phrases.subtitle")}
			/>
			<div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
				<MiniCard
					label={t("admin.analytics.phrases.totalPhrases")}
					value={stats?.totalPhrases.toLocaleString() ?? "—"}
					sub={t("admin.analytics.phrases.categories", { count: stats?.totalCategories ?? 0 })}
					isLoading={isLoading}
				/>
				<MiniCard
					label={t("admin.analytics.phrases.totalReviews")}
					value={stats?.totalReviews.toLocaleString() ?? "—"}
					sub={
						stats?.totalReviewsChangePercent !== null &&
						stats?.totalReviewsChangePercent !== undefined
							? `${stats.totalReviewsChangePercent > 0 ? "+" : ""}${stats.totalReviewsChangePercent}% ${t("admin.analytics.phrases.vsPrev")}`
							: undefined
					}
					isLoading={isLoading}
				/>
				<MiniCard
					label={t("admin.analytics.phrases.retentionRate")}
					value={stats ? `${stats.retentionRatePercent}%` : "—"}
					sub={t("admin.analytics.phrases.avgGrade", { grade: stats?.avgGrade.toFixed(1) ?? "—" })}
					valueClassName="text-grn-t"
					isLoading={isLoading}
				/>
				<MiniCard
					label={t("admin.analytics.phrases.learningKnown")}
					value={stats ? `${stats.learningCount} / ${stats.knownCount}` : "—"}
					sub={t("admin.analytics.phrases.learningKnownSub")}
					isLoading={isLoading}
				/>
			</div>
		</AdminCard>
	);
};
