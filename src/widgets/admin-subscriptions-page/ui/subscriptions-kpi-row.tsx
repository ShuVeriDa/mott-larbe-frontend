import { ReactNode } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminSubscriptionsStats } from "@/entities/admin-subscription";

import { Typography } from "@/shared/ui/typography";
interface Props {
	stats: AdminSubscriptionsStats | undefined;
	isLoading: boolean;
}

const KpiCard = ({
	label,
	value,
	sub,
	isLoading,
}: {
	label: string;
	value: string | number;
	sub?: ReactNode;
	isLoading: boolean;
}) => (
	<div className="rounded-[11px] border border-bd-1 bg-surf p-3 transition-colors">
		<div className="mb-1.5 text-[11px] font-medium tracking-[0.2px] text-t-3">
			{label}
		</div>
		{isLoading ? (
			<div className="mb-1 h-5 w-16 animate-pulse rounded bg-surf-3" />
		) : (
			<div className="mb-0.5 text-[20px] font-semibold leading-none text-t-1">
				{value}
			</div>
		)}
		{sub && (
			<div className="text-[11px] text-t-3">{sub}</div>
		)}
	</div>
);

export const SubscriptionsKpiRow = ({ stats, isLoading }: Props) => {
	const { t } = useI18n();

	return (
		<div className="mb-4 grid grid-cols-4 gap-2.5 max-md:grid-cols-2">
			<KpiCard
				label={t("admin.subscriptions.kpi.active")}
				value={stats?.activeCount ?? 0}
				sub={
					stats?.newThisMonth !== undefined ? (
						<>
							<Typography tag="span" className="text-grn-t">+{stats.newThisMonth}</Typography>{" "}
							{t("admin.subscriptions.kpi.perMonth")}
						</>
					) : null
				}
				isLoading={isLoading}
			/>
			<KpiCard
				label={t("admin.subscriptions.kpi.trialing")}
				value={stats?.trialingCount ?? 0}
				sub={t("admin.subscriptions.kpi.trialingSub")}
				isLoading={isLoading}
			/>
			<KpiCard
				label={t("admin.subscriptions.kpi.canceled")}
				value={stats?.canceledCount ?? 0}
				sub={
					stats?.churnThisMonth !== undefined ? (
						<>
							<Typography tag="span" className="text-red-t">+{stats.churnThisMonth}</Typography>{" "}
							{t("admin.subscriptions.kpi.vsLastMonth")}
						</>
					) : null
				}
				isLoading={isLoading}
			/>
			<KpiCard
				label={t("admin.subscriptions.kpi.expired")}
				value={stats?.expiredCount ?? 0}
				sub={t("admin.subscriptions.kpi.expiredSub")}
				isLoading={isLoading}
			/>
		</div>
	);
};
