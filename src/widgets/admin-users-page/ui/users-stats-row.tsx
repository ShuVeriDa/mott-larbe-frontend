"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminUsersStats } from "@/entities/admin-user";
import { AdminStatCard, AdminStatCardSkeleton } from "@/shared/ui/admin-stat-card";

interface UsersStatsRowProps {
	stats: AdminUsersStats | undefined;
	isLoading: boolean;
}

export const UsersStatsRow = ({ stats, isLoading }: UsersStatsRowProps) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="mb-3.5 grid grid-cols-5 gap-2 max-md:grid-cols-3 max-sm:grid-cols-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<AdminStatCardSkeleton key={i} />
				))}
			</div>
		);
	}

	return (
		<div className="mb-3.5 grid grid-cols-5 gap-2 max-md:grid-cols-3 max-sm:grid-cols-2">
			<AdminStatCard
				label={t("admin.users.stats.total")}
				value={stats.total.toLocaleString("ru-RU")}
				sub={t("admin.users.stats.newThisMonth", {
					count: stats.newThisMonth,
				})}
			/>
			<AdminStatCard
				label={t("admin.users.stats.active")}
				value={stats.active.toLocaleString("ru-RU")}
				sub={`${stats.activePercent.toFixed(1)}%`}
				valueClassName="text-grn"
			/>
			<AdminStatCard
				label={t("admin.users.stats.blocked")}
				value={stats.blocked.toLocaleString("ru-RU")}
				sub={t("admin.users.stats.blockedSub")}
				valueClassName="text-red"
			/>
			<AdminStatCard
				label={t("admin.users.stats.frozen")}
				value={stats.frozen.toLocaleString("ru-RU")}
				sub={t("admin.users.stats.frozenSub")}
				valueClassName="text-amb"
			/>
			<AdminStatCard
				label={t("admin.users.stats.subscribed")}
				value={stats.withPaidSubscription.toLocaleString("ru-RU")}
				sub={t("admin.users.stats.subscribedSub")}
				valueClassName="text-pur"
			/>
		</div>
	);
};
