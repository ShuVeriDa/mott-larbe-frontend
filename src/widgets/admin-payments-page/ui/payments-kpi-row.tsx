"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminPaymentStats } from "@/entities/admin-payment";
import { GrowthSpan } from "./growth-span";
import { KpiCard } from "./kpi-card";
import { formatCentsIntl } from "@/shared/lib/format-currency";

interface Props {
	stats?: AdminPaymentStats;
	isLoading: boolean;
}

export const PaymentsKpiRow = ({ stats, isLoading }: Props) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="mb-[18px] grid grid-cols-5 gap-2.5 max-md:grid-cols-3 max-sm:grid-cols-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<div
						key={i}
						className={`h-[78px] animate-pulse rounded-card bg-surf-3 ${i >= 3 ? "max-md:hidden" : ""} ${i === 4 ? "max-sm:hidden" : ""}`}
					/>
				))}
			</div>
		);
	}

	const refundAmountStr = formatCentsIntl(stats.refundCents);

	return (
		<div className="mb-[18px] grid grid-cols-5 gap-2.5 max-md:grid-cols-3 max-sm:grid-cols-2">
			<KpiCard
				label={t("admin.payments.kpi.revenue")}
				value={formatCentsIntl(stats.revenueCents)}
				sub={
					<>
						<GrowthSpan val={stats.revenueGrowth} />{" "}
						{t("admin.payments.kpi.momGrowth")}
					</>
				}
			/>
			<KpiCard
				label={t("admin.payments.kpi.transactions")}
				value={stats.transactionCount.toLocaleString("ru-RU")}
				sub={
					<>
						<GrowthSpan val={stats.transactionGrowth} />{" "}
						{t("admin.payments.kpi.vsPrev")}
					</>
				}
			/>
			<KpiCard
				label={t("admin.payments.kpi.refunds")}
				value={String(stats.refundCount)}
				sub={t("admin.payments.kpi.refundAmount").replace(
					"{amount}",
					refundAmountStr,
				)}
			/>
			<KpiCard
				hidden
				label={t("admin.payments.kpi.avgTicket")}
				value={formatCentsIntl(stats.avgTicketCents)}
				sub={
					<>
						<GrowthSpan val={stats.avgTicketGrowth} />{" "}
						{t("admin.payments.kpi.momGrowth")}
					</>
				}
			/>
			<KpiCard
				hidden
				label={t("admin.payments.kpi.failed")}
				value={String(stats.failedCount)}
				sub={
					<>
						<GrowthSpan val={stats.failedGrowth} />{" "}
						{t("admin.payments.kpi.vsPrev")}
					</>
				}
			/>
		</div>
	);
};
