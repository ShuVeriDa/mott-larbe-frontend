import type { AdminSubscriptionsStats } from "@/entities/admin-subscription";
import { useI18n } from "@/shared/lib/i18n";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";
import { Typography } from "@/shared/ui/typography";
import type { ReactNode } from "react";

interface Props {
	stats: AdminSubscriptionsStats | undefined;
	isLoading: boolean;
}

export const SubscriptionsKpiRow = ({ stats, isLoading }: Props) => {
	const { t } = useI18n();

	const activeSubLabel: ReactNode =
		stats?.newThisMonth !== undefined ? (
			<>
				<Typography tag="span" className="text-grn-t">
					+{stats.newThisMonth}
				</Typography>{" "}
				{t("admin.subscriptions.kpi.perMonth")}
			</>
		) : null;

	const canceledSubLabel: ReactNode =
		stats?.churnThisMonth !== undefined ? (
			<>
				<Typography tag="span" className="text-red-t">
					+{stats.churnThisMonth}
				</Typography>{" "}
				{t("admin.subscriptions.kpi.vsLastMonth")}
			</>
		) : null;

	if (isLoading) {
		return (
			<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
				{Array.from({ length: 4 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
			<AdminStatCard
				label={t("admin.subscriptions.kpi.active")}
				value={stats?.activeCount ?? 0}
				sub={activeSubLabel}
			/>
			<AdminStatCard
				label={t("admin.subscriptions.kpi.trialing")}
				value={stats?.trialingCount ?? 0}
				sub={t("admin.subscriptions.kpi.trialingSub")}
			/>
			<AdminStatCard
				label={t("admin.subscriptions.kpi.canceled")}
				value={stats?.canceledCount ?? 0}
				sub={canceledSubLabel}
			/>
			<AdminStatCard
				label={t("admin.subscriptions.kpi.expired")}
				value={stats?.expiredCount ?? 0}
				sub={t("admin.subscriptions.kpi.expiredSub")}
			/>
		</div>
	);
};
