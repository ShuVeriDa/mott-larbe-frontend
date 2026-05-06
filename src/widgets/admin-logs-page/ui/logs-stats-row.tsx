"use client";

import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import type { AdminLogsStats, TrendValue } from "@/entities/admin-log";

interface StatCardProps {
	label: string;
	value: string;
	trend?: TrendValue;
	valueClassName?: string;
	isLoading?: boolean;
	badTrend?: "up" | "down";
}

const StatCard = ({ label, value, trend, valueClassName, isLoading, badTrend }: StatCardProps) => {
	const trendText = trend
		? trend.direction === "neutral"
			? "—"
			: `${trend.direction === "up" ? "↑" : "↓"} ${trend.unit === "percent" ? `${trend.value}%` : trend.unit === "pp" ? `${trend.value} pp` : `${trend.value} ${trend.unit}`}`
		: undefined;

	const isBad = trend && badTrend && trend.direction === badTrend;
	const isGood = trend && badTrend && trend.direction !== "neutral" && trend.direction !== badTrend;

	return (
		<div className="rounded-card border border-bd-1 bg-surf p-3.5 transition-colors">
			<div className="mb-1 text-[11px] font-medium tracking-[0.2px] text-t-3">{label}</div>
			<div
				className={cn(
					"mb-0.5 text-[21px] font-semibold leading-none text-t-1",
					valueClassName,
					isLoading && "animate-pulse text-t-4",
				)}
			>
				{isLoading ? "—" : value}
			</div>
			{trendText && (
				<div
					className={cn(
						"text-[11px] text-t-3",
						isBad && "text-red-t",
						isGood && "text-grn-t",
					)}
				>
					{trendText}
				</div>
			)}
		</div>
	);
};

interface LogsStatsRowProps {
	stats?: AdminLogsStats;
	isLoading?: boolean;
}

export const LogsStatsRow = ({ stats, isLoading }: LogsStatsRowProps) => {
	const { t } = useI18n();

	return (
		<div className="mb-4 grid grid-cols-5 gap-2.5 max-md:grid-cols-3 max-sm:grid-cols-2">
			<StatCard
				label={t("admin.logs.stats.totalEvents")}
				value={stats?.totalEvents24h.value.toLocaleString() ?? "—"}
				trend={stats?.totalEvents24h.trend}
				isLoading={isLoading}
			/>
			<StatCard
				label={t("admin.logs.stats.errors")}
				value={stats?.errors24h.value.toLocaleString() ?? "—"}
				trend={stats?.errors24h.trend}
				valueClassName="text-red-t"
				badTrend="up"
				isLoading={isLoading}
			/>
			<StatCard
				label={t("admin.logs.stats.warnings")}
				value={stats?.warnings24h.value.toLocaleString() ?? "—"}
				trend={stats?.warnings24h.trend}
				valueClassName="text-amb-t"
				badTrend="up"
				isLoading={isLoading}
			/>
			<StatCard
				label={t("admin.logs.stats.avgResponse")}
				value={stats ? `${stats.avgResponseMs.value} ${t("admin.logs.stats.ms")}` : "—"}
				trend={stats?.avgResponseMs.trend}
				badTrend="up"
				isLoading={isLoading}
			/>
			<StatCard
				label={t("admin.logs.stats.errorRate")}
				value={stats ? `${stats.errorRatePct.value}%` : "—"}
				trend={stats?.errorRatePct.trend}
				badTrend="up"
				isLoading={isLoading}
			/>
		</div>
	);
};
