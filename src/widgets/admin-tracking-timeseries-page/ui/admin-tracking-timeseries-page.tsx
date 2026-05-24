"use client";

import {
	useAdminAnalyticsTimeseries,
	useAdminAnalyticsTimeseriesSummary,
	useAnalyticsRange,
	useInvalidateAdminAnalytics,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/locales";
import { AnalyticsTabs } from "@/widgets/admin-tracking-overview-page";
import { AnalyticsToolbar } from "@/widgets/admin-tracking-overview-page";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";
import { useTimeseriesState } from "../model/use-timeseries-state";
import { formatNumber, formatDuration, formatPercent } from "./format";
import { TimeseriesChart } from "./timeseries-chart";
import type { ComponentProps } from "react";

type TrackingDict = Dictionary["admin"]["tracking"];

interface AdminTrackingTimeseriesPageProps {
	lang: Locale;
	dict: TrackingDict;
}

const formatValue = (metric: string, v: number) => {
	if (metric === "avgSessionSec") return formatDuration(v);
	if (metric === "bounceRate") return formatPercent(v);
	return formatNumber(v);
};

export const AdminTrackingTimeseriesPage = ({ lang, dict }: AdminTrackingTimeseriesPageProps) => {
	const rangeState = useAnalyticsRange();
	const { range } = rangeState;
	const { metric, granularity, compare, setMetric, setGranularity, setCompare, METRICS, GRANULARITIES } =
		useTimeseriesState();
	const invalidate = useInvalidateAdminAnalytics();

	const timeseries = useAdminAnalyticsTimeseries({ metric, granularity, from: range.from, to: range.to }, compare);
	const summary = useAdminAnalyticsTimeseriesSummary({ metric, granularity, from: range.from, to: range.to });

	const isCompareData = timeseries.data && "current" in timeseries.data;
	const currentPoints = isCompareData
		? (timeseries.data as { current: { date: string; value: number }[] }).current
		: (timeseries.data as { date: string; value: number }[] | undefined);
	const previousPoints = isCompareData
		? (timeseries.data as { previous: { date: string; value: number }[] }).previous
		: undefined;

	const s = summary.data;

	const handleToggleCompare: ComponentProps<"button">["onClick"] = () => setCompare(!compare);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-base font-medium text-t-1">
						{dict.tabs.timeseries}
					</h1>
				</div>
			</header>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				<AnalyticsTabs lang={lang} active="timeseries" dict={dict.tabs} />

				<div className="mt-4 mb-4">
					<AnalyticsToolbar rangeState={rangeState} dict={dict.toolbar} onRefresh={invalidate} />
				</div>

				<div className="mb-3.5 flex flex-wrap items-center gap-2">
					<div className="flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf-2 p-0.5">
						{METRICS.map((m) => {
							const handleClick: ComponentProps<"button">["onClick"] = () => setMetric(m);
							const label = dict.metrics[m as keyof typeof dict.metrics];
							return (
								<Button
									key={m}
									onClick={handleClick}
									title={label}
									className={cn(
										"h-[26px] rounded-md px-2.5 text-[11.5px] font-medium transition-all",
										metric === m ? "bg-surf text-t-1 shadow-sm" : "text-t-2 hover:text-t-1",
									)}
								>
									{label}
								</Button>
							);
						})}
					</div>

					<div className="flex items-center gap-0.5 rounded-lg border border-bd-2 bg-surf-2 p-0.5">
						{GRANULARITIES.map((g) => {
							const handleClick: ComponentProps<"button">["onClick"] = () => setGranularity(g);
							const label = dict.timeseries.granularity[g as keyof typeof dict.timeseries.granularity];
							return (
								<Button
									key={g}
									onClick={handleClick}
									title={label}
									className={cn(
										"h-[26px] rounded-md px-2.5 text-[11.5px] font-medium transition-all",
										granularity === g ? "bg-surf text-t-1 shadow-sm" : "text-t-2 hover:text-t-1",
									)}
								>
									{label}
								</Button>
							);
						})}
					</div>

					<Button
						onClick={handleToggleCompare}
						title={dict.timeseries.compare}
						className={cn(
							"flex h-[30px] items-center rounded-base border px-2.5 text-[12px] font-medium transition-colors",
							compare
								? "border-acc bg-acc/10 text-acc"
								: "border-bd-2 bg-transparent text-t-2 hover:border-bd-3 hover:text-t-1",
						)}
					>
						{dict.timeseries.compare}
					</Button>
				</div>

				{s && (
					<div className="mb-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-4 max-sm:gap-2">
						{(["total", "avg", "peak", "min"] as const).map((key) => {
							const raw =
								key === "total" ? s.total :
								key === "avg" ? s.avg :
								key === "peak" ? s.peak?.value :
								s.min?.value;
							return (
								<div key={key} className="rounded-card border border-bd-1 bg-surf p-3.5 transition-colors">
									<p className="mb-1.5 text-[11px] font-medium tracking-[0.3px] text-t-3">
										{dict.timeseries.summary[key]}
									</p>
									{summary.isLoading ? (
										<div className="h-6 w-20 animate-pulse rounded bg-surf-3" />
									) : (
										<p className="text-[22px] font-semibold leading-none text-t-1">
											{raw != null ? formatValue(metric, raw) : "—"}
										</p>
									)}
								</div>
							);
						})}
					</div>
				)}

				<div className="rounded-card border border-bd-1 bg-surf p-4 transition-colors">
					{timeseries.isLoading ? (
						<div className="h-[300px] animate-pulse rounded-[9px] bg-surf-2" />
					) : !currentPoints?.length ? (
						<p className="text-[12px] text-t-3">{dict.timeseries.noData}</p>
					) : (
						<TimeseriesChart
							current={currentPoints}
							previous={previousPoints}
							metric={metric}
							labelCurrent={dict.metrics[metric as keyof typeof dict.metrics] ?? metric}
							labelPrevious={dict.timeseries.compare}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
