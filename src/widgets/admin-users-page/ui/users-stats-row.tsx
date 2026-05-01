"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminUsersStats } from "@/entities/admin-user";

interface StatCardProps {
	label: string;
	value: number | string;
	sub: string;
	valueColor?: string;
}

const StatCard = ({ label, value, sub, valueColor }: StatCardProps) => (
	<div className="rounded-[10px] border border-bd-1 bg-surf px-3 py-[11px]">
		<div className="mb-1 text-[10.5px] font-medium text-t-3">{label}</div>
		<div
			className={`text-[20px] font-semibold leading-none ${valueColor ?? "text-t-1"}`}
		>
			{typeof value === "number" ? value.toLocaleString("ru-RU") : value}
		</div>
		<div className="mt-0.5 text-[10.5px] text-t-3">{sub}</div>
	</div>
);

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
					<div
						key={i}
						className="h-[68px] animate-pulse rounded-[10px] bg-surf"
					/>
				))}
			</div>
		);
	}

	return (
		<div className="mb-3.5 grid grid-cols-5 gap-2 max-md:grid-cols-3 max-sm:grid-cols-2">
			<StatCard
				label={t("admin.users.stats.total")}
				value={stats.total}
				sub={t("admin.users.stats.newThisMonth", {
					count: stats.newThisMonth,
				})}
			/>
			<StatCard
				label={t("admin.users.stats.active")}
				value={stats.active}
				sub={`${stats.activePercent.toFixed(1)}%`}
				valueColor="text-grn"
			/>
			<StatCard
				label={t("admin.users.stats.blocked")}
				value={stats.blocked}
				sub={t("admin.users.stats.blockedSub")}
				valueColor="text-red"
			/>
			<StatCard
				label={t("admin.users.stats.frozen")}
				value={stats.frozen}
				sub={t("admin.users.stats.frozenSub")}
				valueColor="text-amb"
			/>
			<StatCard
				label={t("admin.users.stats.subscribed")}
				value={stats.withPaidSubscription}
				sub={t("admin.users.stats.subscribedSub")}
				valueColor="text-pur"
			/>
		</div>
	);
};
