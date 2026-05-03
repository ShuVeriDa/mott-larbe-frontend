"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminDashboardKpi } from "@/entities/admin-dashboard";

const formatRevenue = (cents: number, currency: string) => {
	const amount = cents / 100;
	if (currency === "RUB") return `₽${Math.round(amount).toLocaleString("ru-RU")}`;
	return new Intl.NumberFormat("en", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(amount);
};

const formatNum = (n: number) => n.toLocaleString("ru-RU");

interface TrendProps {
	value: number | null;
	label: string;
}

const TrendChip = ({ value, label }: TrendProps) => {
	if (value === null) return <span className="text-[11px] text-t-3">{label}</span>;
	const up = value >= 0;
	return (
		<span className={cn("flex items-center gap-1 text-[11px]", up ? "text-grn-t" : "text-red-t")}>
			<svg className="size-3 shrink-0" viewBox="0 0 12 12" fill="none">
				{up ? (
					<path
						d="M6 9V3M3 6l3-3 3 3"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				) : (
					<path
						d="M6 3v6M9 6L6 9 3 6"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				)}
			</svg>
			{up ? "+" : ""}
			{value}% {label}
		</span>
	);
};

const AbsoluteTrend = ({ value, label }: { value: number; label: string }) => {
	const up = value >= 0;
	return (
		<span className={cn("flex items-center gap-1 text-[11px]", up ? "text-grn-t" : "text-red-t")}>
			<svg className="size-3 shrink-0" viewBox="0 0 12 12" fill="none">
				{up ? (
					<path
						d="M6 9V3M3 6l3-3 3 3"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				) : (
					<path
						d="M6 3v6M9 6L6 9 3 6"
						stroke="currentColor"
						strokeWidth="1.4"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				)}
			</svg>
			{up ? "+" : ""}
			{value} {label}
		</span>
	);
};

interface DashboardKpiGridProps {
	kpi: AdminDashboardKpi;
}

export const DashboardKpiGrid = ({ kpi }: DashboardKpiGridProps) => {
	const { t } = useI18n();

	const cards = [
		{
			label: t("admin.dashboard.kpi.totalUsers"),
			value: formatNum(kpi.totalUsers),
			trend: (
				<AbsoluteTrend
					value={kpi.newUsersInPeriod}
					label={t("admin.dashboard.kpi.newThisPeriod").replace("{count}", "")}
				/>
			),
		},
		{
			label: t("admin.dashboard.kpi.activeUsers7d"),
			value: formatNum(kpi.activeUsers7d),
			trend: (
				<TrendChip
					value={kpi.activeUsers7dTrend}
					label={t("admin.dashboard.kpi.vsPrev")}
				/>
			),
		},
		{
			label: t("admin.dashboard.kpi.paidSubscriptions"),
			value: formatNum(kpi.paidSubscriptions),
			trend: (
				<AbsoluteTrend
					value={kpi.newPaidSubsInPeriod}
					label={t("admin.dashboard.kpi.newThisPeriod").replace("{count}", "")}
				/>
			),
		},
		{
			label: t("admin.dashboard.kpi.revenue"),
			value: formatRevenue(kpi.revenueCents, kpi.currency),
			trend: (
				<TrendChip
					value={kpi.revenueTrend}
					label={t("admin.dashboard.kpi.vsPrev")}
				/>
			),
		},
	];

	return (
		<div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4 max-sm:gap-2">
			{cards.map((card) => (
				<div
					key={card.label}
					className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf px-3.5 py-3.5 transition-colors max-sm:px-3 max-sm:py-3"
				>
					<div className="mb-1.5 truncate text-[11px] font-medium tracking-wide text-t-3">
						{card.label}
					</div>
					<div className="mb-1.5 text-[24px] font-semibold leading-none text-t-1 max-sm:text-[19px]">
						{card.value}
					</div>
					{card.trend}
				</div>
			))}
		</div>
	);
};

export const DashboardKpiGridSkeleton = () => (
	<div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4 max-sm:gap-2">
		{Array.from({ length: 4 }).map((_, i) => (
			<div
				key={i}
				className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf px-3.5 py-3.5"
			>
				<div className="mb-2 h-2.5 w-24 animate-pulse rounded bg-surf-3" />
				<div className="mb-2 h-7 w-20 animate-pulse rounded bg-surf-3" />
				<div className="h-2.5 w-16 animate-pulse rounded bg-surf-3" />
			</div>
		))}
	</div>
);
