"use client";

import {
	useAdminAnalyticsOverview,
	useAdminAnalyticsMultiTimeseries,
	useAdminAnalyticsTopPages,
	useAdminAnalyticsTopReferrersInfinite,
	useAnalyticsRange,
	useExportAnalyticsOverviewCsv,
	useInvalidateAdminAnalytics,
} from "@/features/admin-analytics";
import type { Dictionary, Locale } from "@/i18n/locales";
import { MetricCard } from "./metric-card";
import { TrafficChart } from "./traffic-chart";
import { TopList } from "./top-list";
import { AnalyticsToolbar } from "./analytics-toolbar";
import { AnalyticsTabs } from "./analytics-tabs";
import { RealtimeBadge } from "./realtime-badge";
import {
	formatNumber,
	formatDuration,
	formatPercent,
	computeDelta,
	granularityForRange,
} from "../lib/format";

type TrackingDict = Dictionary["admin"]["tracking"];

interface AdminTrackingOverviewPageProps {
	lang: Locale;
	dict: TrackingDict;
}

export const AdminTrackingOverviewPage = ({ lang, dict }: AdminTrackingOverviewPageProps) => {
	const rangeState = useAnalyticsRange();
	const { range } = rangeState;
	const granularity = granularityForRange(range);

	const overview = useAdminAnalyticsOverview(range.from, range.to);
	const multi = useAdminAnalyticsMultiTimeseries({
		metrics: ["pageviews", "uniqueVisitors"],
		granularity,
		from: range.from,
		to: range.to,
	});
	const topPages = useAdminAnalyticsTopPages({ from: range.from, to: range.to, limit: 10 });
	const topReferrers = useAdminAnalyticsTopReferrersInfinite({ from: range.from, to: range.to, limit: 10 });
	const exportCsv = useExportAnalyticsOverviewCsv();
	const invalidate = useInvalidateAdminAnalytics();

	const cur = overview.data?.current;
	const prev = overview.data?.previous;

	const handleExport = () => {
		exportCsv.mutate({ from: range.from, to: range.to }, {
			onSuccess: (blob) => {
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `tracking-${range.from}-${range.to}.csv`;
				a.click();
				URL.revokeObjectURL(url);
			},
		});
	};

	const referrers = topReferrers.data?.pages.flatMap((p) => p) ?? [];

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<header className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3.5 transition-colors max-sm:px-3 max-sm:py-2.5">
				<div className="min-w-0 flex-1">
					<h1 className="font-display text-base font-medium text-t-1">
						{dict.meta.title.split("—")[0].trim()}
					</h1>
					<p className="text-[11px] text-t-3 max-sm:hidden">
						{dict.meta.description}
					</p>
				</div>
				<RealtimeBadge online={dict.realtime.online} />
			</header>

			<div className="overflow-y-auto px-5 py-5 pb-10 max-sm:px-3 max-sm:py-3 max-sm:pb-24">
				<AnalyticsTabs lang={lang} active="overview" dict={dict.tabs} />

				<div className="mt-4 mb-4">
					<AnalyticsToolbar
						rangeState={rangeState}
						dict={dict.toolbar}
						onRefresh={invalidate}
						onExport={handleExport}
						isExporting={exportCsv.isPending}
					/>
				</div>

				<div className="mb-4 grid grid-cols-2 gap-2.5 lg:grid-cols-6 max-sm:gap-2">
					<MetricCard
						label={dict.metrics.uniqueVisitors}
						value={cur ? formatNumber(cur.uniqueVisitors) : "—"}
						delta={cur && prev ? computeDelta(cur.uniqueVisitors, prev.uniqueVisitors) : null}
						vsLabel={dict.overview.vsPrev}
						loading={overview.isLoading}
					/>
					<MetricCard
						label={dict.metrics.sessions}
						value={cur ? formatNumber(cur.sessions) : "—"}
						delta={cur && prev ? computeDelta(cur.sessions, prev.sessions) : null}
						vsLabel={dict.overview.vsPrev}
						loading={overview.isLoading}
					/>
					<MetricCard
						label={dict.metrics.pageviews}
						value={cur ? formatNumber(cur.pageviews) : "—"}
						delta={cur && prev ? computeDelta(cur.pageviews, prev.pageviews) : null}
						vsLabel={dict.overview.vsPrev}
						loading={overview.isLoading}
					/>
					<MetricCard
						label={dict.metrics.totalEvents}
						value={cur ? formatNumber(cur.totalEvents) : "—"}
						delta={cur && prev ? computeDelta(cur.totalEvents, prev.totalEvents) : null}
						vsLabel={dict.overview.vsPrev}
						loading={overview.isLoading}
					/>
					<MetricCard
						label={dict.metrics.avgSessionSec}
						value={cur ? formatDuration(cur.avgSessionSec) : "—"}
						delta={cur && prev ? computeDelta(cur.avgSessionSec, prev.avgSessionSec) : null}
						vsLabel={dict.overview.vsPrev}
						loading={overview.isLoading}
					/>
					<MetricCard
						label={dict.metrics.bounceRate}
						value={cur ? formatPercent(cur.bounceRate) : "—"}
						delta={cur && prev ? computeDelta(cur.bounceRate, prev.bounceRate) : null}
						vsLabel={dict.overview.vsPrev}
						inverse
						loading={overview.isLoading}
					/>
				</div>

				<div className="mb-3.5 rounded-card border border-bd-1 bg-surf p-4 transition-colors">
					<p className="mb-3 text-[13px] font-semibold text-t-1">{dict.overview.chart}</p>
					<TrafficChart
						pageviews={multi.data?.pageviews}
						visitors={multi.data?.uniqueVisitors}
						loading={multi.isLoading}
						labelPageviews={dict.metrics.pageviews}
						labelVisitors={dict.metrics.uniqueVisitors}
					/>
				</div>

				<div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
					<div className="rounded-card border border-bd-1 bg-surf p-4 transition-colors">
						<p className="mb-3 text-[13px] font-semibold text-t-1">{dict.overview.topPages}</p>
						<TopList
							items={topPages.data}
							loading={topPages.isLoading}
							noData={dict.common.noData}
							direct={dict.common.direct}
						/>
					</div>
					<div className="rounded-card border border-bd-1 bg-surf p-4 transition-colors">
						<p className="mb-3 text-[13px] font-semibold text-t-1">{dict.overview.topReferrers}</p>
						<TopList
							items={referrers}
							loading={topReferrers.isLoading}
							noData={dict.common.noData}
							direct={dict.common.direct}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
