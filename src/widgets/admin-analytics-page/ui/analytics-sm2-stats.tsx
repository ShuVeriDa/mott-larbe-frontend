"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { Sm2Stats } from "@/entities/admin-analytics";

interface MiniCardProps {
	label: string;
	value: string;
	sub?: string;
	valueClassName?: string;
	isLoading?: boolean;
}

const MiniCard = ({
	label,
	value,
	sub,
	valueClassName,
	isLoading,
}: MiniCardProps) => (
	<div className="rounded-[9px] bg-surf-2 p-3">
		<div className="mb-1 text-[10.5px] text-t-3">{label}</div>
		<div
			className={cn(
				"text-[18px] font-semibold leading-none text-t-1",
				valueClassName,
				isLoading && "animate-pulse text-t-4",
			)}
		>
			{isLoading ? "—" : value}
		</div>
		{sub && (
			<div className="mt-0.5 text-[10.5px] text-t-3">{sub}</div>
		)}
	</div>
);

interface AnalyticsSm2StatsProps {
	stats?: Sm2Stats;
	isLoading?: boolean;
}

export const AnalyticsSm2Stats = ({
	stats,
	isLoading,
}: AnalyticsSm2StatsProps) => {
	const { t } = useI18n();

	return (
		<div className="rounded-card border border-bd-1 bg-surf transition-colors">
			<div className="flex items-center justify-between px-4 pt-3.5 pb-3">
				<span className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.sm2.title")}
				</span>
				<span className="text-[11px] text-t-3">
					{t("admin.analytics.sm2.subtitle")}
				</span>
			</div>

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
					value={
						stats
							? `${stats.avgGrade.toFixed(1)} / 5`
							: "—"
					}
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
					sub={
						stats
							? `easeFactor ${stats.avgEaseFactor.toFixed(2)}`
							: undefined
					}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
};
