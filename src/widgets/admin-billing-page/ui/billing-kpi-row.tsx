"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { BillingStats } from "@/entities/admin-billing";

const fmtNum = (n: number) => n.toLocaleString("ru-RU");
const fmtMoney = (cents: number) => {
	const k = cents / 100 / 1000;
	if (k >= 1000) return `${(k / 1000).toFixed(1)} млн`;
	if (k >= 1) return `${Math.round(k)} тыс.`;
	return `${Math.round(cents / 100)}`;
};

interface KpiCardProps {
	label: string;
	value: string;
	sub?: React.ReactNode;
}

const KpiCard = ({ label, value, sub }: KpiCardProps) => (
	<div className="rounded-[11px] border border-bd-1 bg-surf px-3.5 py-3 transition-colors">
		<div className="mb-1.5 text-[11px] font-medium tracking-[0.2px] text-t-3">
			{label}
		</div>
		<div className="mb-1 text-[20px] font-semibold leading-none text-t-1">
			{value}
		</div>
		{sub && (
			<div className="flex items-center gap-1 text-[11px] text-t-3">{sub}</div>
		)}
	</div>
);

const KpiCardSkeleton = () => (
	<div className="rounded-[11px] border border-bd-1 bg-surf px-3.5 py-3">
		<div className="mb-1.5 h-2.5 w-20 animate-pulse rounded bg-surf-3" />
		<div className="mb-1 h-5 w-16 animate-pulse rounded bg-surf-3" />
		<div className="h-2.5 w-24 animate-pulse rounded bg-surf-3" />
	</div>
);

interface BillingKpiRowProps {
	stats: BillingStats | undefined;
	isLoading: boolean;
}

export const BillingKpiRow = ({ stats, isLoading }: BillingKpiRowProps) => {
	const { t } = useI18n();

	if (isLoading || !stats) {
		return (
			<div className="mb-5 grid grid-cols-5 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
				{Array.from({ length: 5 }).map((_, i) => (
					<KpiCardSkeleton key={i} />
				))}
			</div>
		);
	}

	const mrrGrowthSign = (stats.mrrGrowthPct ?? 0) >= 0 ? "+" : "";
	const convSign = stats.conversionDeltaPp >= 0 ? "+" : "";
	const churnSign = stats.churnDeltaPp >= 0 ? "+" : "";

	return (
		<div className="mb-5 grid grid-cols-5 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
			<KpiCard
				label={t("admin.plans.kpi.paying")}
				value={fmtNum(stats.payingCount)}
				sub={
					<>
						<span className="text-grn-t">+{stats.payingDeltaLast30}</span>
						<span>{t("admin.plans.kpi.payingMonth")}</span>
					</>
				}
			/>
			<KpiCard
				label={t("admin.plans.kpi.mrr")}
				value={`${fmtMoney(stats.mrrCents)} ₽`}
				sub={
					stats.mrrGrowthPct !== null ? (
						<>
							<span className={stats.mrrGrowthPct >= 0 ? "text-grn-t" : "text-red-t"}>
								{mrrGrowthSign}{stats.mrrGrowthPct.toFixed(1)}%
							</span>
							<span>{t("admin.plans.kpi.mrrMoM")}</span>
						</>
					) : undefined
				}
			/>
			<KpiCard
				label={t("admin.plans.kpi.arr")}
				value={`${fmtMoney(stats.arrCents)} ₽`}
				sub={<span>{t("admin.plans.kpi.arrForecast")}</span>}
			/>
			<KpiCard
				label={t("admin.plans.kpi.conversion")}
				value={`${stats.conversionRate.toFixed(1)}%`}
				sub={
					<>
						<span className={stats.conversionDeltaPp >= 0 ? "text-grn-t" : "text-red-t"}>
							{convSign}{stats.conversionDeltaPp.toFixed(1)} пп
						</span>
						<span>{t("admin.plans.kpi.vsLastMonth")}</span>
					</>
				}
			/>
			<KpiCard
				label={t("admin.plans.kpi.churn")}
				value={`${stats.churnRate.toFixed(1)}%`}
				sub={
					<>
						<span className={stats.churnDeltaPp <= 0 ? "text-grn-t" : "text-red-t"}>
							{churnSign}{stats.churnDeltaPp.toFixed(1)} пп
						</span>
						<span>{t("admin.plans.kpi.vsLastMonth")}</span>
					</>
				}
			/>
		</div>
	);
};
