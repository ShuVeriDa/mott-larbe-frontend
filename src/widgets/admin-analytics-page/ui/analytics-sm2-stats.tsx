"use client";

import type { Sm2Stats } from "@/entities/admin-analytics";
import { useI18n } from "@/shared/lib/i18n";
import { AdminCard, AdminCardHeader } from "@/shared/ui/admin-card";
import { MiniCard } from "@/shared/ui/mini-card";

interface AnalyticsSm2StatsProps {
	stats?: Sm2Stats;
	isLoading?: boolean;
}

export const AnalyticsSm2Stats = ({ stats, isLoading }: AnalyticsSm2StatsProps) => {
	const { t } = useI18n();

	return (
		<AdminCard>
			<AdminCardHeader
				title={t("admin.analytics.sm2.title")}
				subtitle={t("admin.analytics.sm2.subtitle")}
			/>
			<div className="grid grid-cols-2 gap-2.5 px-4 pb-4">
				<MiniCard
					label={t("admin.analytics.sm2.totalReviews")}
					value={stats?.totalReviews.toLocaleString() ?? "—"}
					sub={
						stats?.totalReviewsChangePercent !== null &&
						stats?.totalReviewsChangePercent !== undefined
							? `${stats.totalReviewsChangePercent > 0 ? "+" : ""}${stats.totalReviewsChangePercent}% ${t("admin.analytics.sm2.vsPrev")}`
							: undefined
					}
					isLoading={isLoading}
				/>
				<MiniCard
					label={t("admin.analytics.sm2.avgGrade")}
					value={stats ? `${stats.avgGrade.toFixed(1)} / 5` : "—"}
					sub={t("admin.analytics.sm2.goodRetention")}
					isLoading={isLoading}
				/>
				<MiniCard
					label={t("admin.analytics.sm2.retentionRate")}
					value={stats ? `${stats.retentionRatePercent}%` : "—"}
					sub={t("admin.analytics.sm2.retentionGrade")}
					valueClassName="text-grn-t"
					isLoading={isLoading}
				/>
				<MiniCard
					label={t("admin.analytics.sm2.avgInterval")}
					value={
						stats
							? `${stats.avgIntervalDays.toFixed(1)} ${t("admin.analytics.sm2.days")}`
							: "—"
					}
					sub={stats ? `easeFactor ${stats.avgEaseFactor.toFixed(2)}` : undefined}
					isLoading={isLoading}
				/>
			</div>
		</AdminCard>
	);
};
