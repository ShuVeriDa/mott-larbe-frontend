"use client";

import { Typography } from "@/shared/ui/typography";

import { ReactNode } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import type { AdminPaymentStats } from "@/entities/admin-payment";

const fmtMoney = (cents: number, currency = "RUB") => {
	try {
		return new Intl.NumberFormat("ru-RU", {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(cents / 100);
	} catch {
		return `${Math.round(cents / 100).toLocaleString("ru-RU")} ₽`;
	}
};

const fmtGrowth = (val: number | null | undefined): string => {
	if (val == null) return "";
	const sign = val >= 0 ? "+" : "";
	return `${sign}${val.toFixed(1)}%`;
};

const GrowthSpan = ({ val }: { val: number | null | undefined }) => {
	if (val == null) return null;
	const positive = val >= 0;
	return (
		<Typography tag="span" className={positive ? "text-grn-t" : "text-red-t"}>
			{fmtGrowth(val)}
		</Typography>
	);
};

interface KpiCardProps {
	label: string;
	value: string;
	sub: ReactNode;
	hidden?: boolean;
}

const KpiCard = ({ label, value, sub, hidden }: KpiCardProps) => (
	<div
		className={`rounded-card border border-bd-1 bg-surf px-3.5 py-3 transition-colors ${hidden ? "max-md:hidden" : ""}`}
	>
		<div className="mb-[5px] text-[11px] font-medium tracking-[0.2px] text-t-3">
			{label}
		</div>
		<div className="mb-0.5 text-[20px] font-semibold leading-none text-t-1">
			{value}
		</div>
		<div className="text-[11px] text-t-3">{sub}</div>
	</div>
);

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

	const refundAmountStr = fmtMoney(stats.refundCents);

	return (
		<div className="mb-[18px] grid grid-cols-5 gap-2.5 max-md:grid-cols-3 max-sm:grid-cols-2">
			<KpiCard
				label={t("admin.payments.kpi.revenue")}
				value={fmtMoney(stats.revenueCents)}
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
				value={fmtMoney(stats.avgTicketCents)}
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
