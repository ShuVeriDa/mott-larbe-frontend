"use client";

import type { EventsChartSeries } from "@/entities/admin-analytics";
import {
	CHART_AXIS_TICK_STYLE,
	CHART_TOOLTIP_CONTENT_STYLE,
	CHART_TOOLTIP_CURSOR_STYLE,
	CHART_TOOLTIP_LABEL_STYLE,
} from "@/shared/lib/chart-config";
import { useI18n } from "@/shared/lib/i18n";
import { AdminCard } from "@/shared/ui/admin-card";
import { Typography } from "@/shared/ui/typography";
import {
	Bar,
	CartesianGrid,
	ComposedChart,
	Line,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ChartDataPoint {
	label: string;
	openText: number;
	addToDict: number;
	failLookup: number;
}

interface AnalyticsEventsChartProps {
	labels?: string[];
	series?: EventsChartSeries;
	isLoading?: boolean;
}

export const AnalyticsEventsChart = ({ labels, series, isLoading }: AnalyticsEventsChartProps) => {
	const { t } = useI18n();

	const data: ChartDataPoint[] =
		labels && series
			? labels.map((label, i) => ({
					label,
					openText: series.openText[i] ?? 0,
					addToDict: series.addToDict[i] ?? 0,
					failLookup: series.failLookup[i] ?? 0,
				}))
			: [];

	return (
		<AdminCard>
			<div className="flex flex-wrap items-center justify-between gap-1 px-4 pt-3.5">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.analytics.eventsChart.title")}
				</Typography>
				<div className="flex flex-wrap items-center gap-2.5">
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<Typography tag="span" className="inline-block size-2 rounded-[2px] bg-acc/70" />
						{t("admin.analytics.eventsChart.openText")}
					</div>
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<Typography tag="span" className="inline-block size-2 rounded-full bg-grn" />
						{t("admin.analytics.eventsChart.addToDict")}
					</div>
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<Typography tag="span" className="inline-block size-2 rounded-full bg-red" />
						{t("admin.analytics.eventsChart.failLookup")}
					</div>
				</div>
			</div>

			<div className="px-4 pb-4 pt-2">
				{isLoading || data.length === 0 ? (
					<div className="h-[190px] animate-pulse rounded-lg bg-surf-2" />
				) : (
					<ResponsiveContainer width="100%" height={190}>
						<ComposedChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
							<CartesianGrid strokeDasharray="0" stroke="var(--bd-1)" vertical={false} />
							<XAxis
								dataKey="label"
								tick={CHART_AXIS_TICK_STYLE}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								yAxisId="left"
								tick={CHART_AXIS_TICK_STYLE}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								yAxisId="right"
								orientation="right"
								tick={CHART_AXIS_TICK_STYLE}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip
								contentStyle={CHART_TOOLTIP_CONTENT_STYLE}
								labelStyle={CHART_TOOLTIP_LABEL_STYLE}
								cursor={CHART_TOOLTIP_CURSOR_STYLE}
							/>
							<Bar
								yAxisId="left"
								dataKey="openText"
								name={t("admin.analytics.eventsChart.openText")}
								fill="var(--acc)"
								fillOpacity={0.7}
								radius={[3, 3, 0, 0]}
								maxBarSize={18}
							/>
							<Line
								yAxisId="right"
								dataKey="addToDict"
								name={t("admin.analytics.eventsChart.addToDict")}
								stroke="var(--grn)"
								strokeWidth={1.5}
								dot={{ r: 3, fill: "var(--grn)" }}
								activeDot={{ r: 5 }}
								type="monotone"
							/>
							<Line
								yAxisId="left"
								dataKey="failLookup"
								name={t("admin.analytics.eventsChart.failLookup")}
								stroke="var(--red-token)"
								strokeWidth={1.5}
								strokeDasharray="4 3"
								dot={{ r: 3, fill: "var(--red-token)" }}
								activeDot={{ r: 5 }}
								type="monotone"
							/>
						</ComposedChart>
					</ResponsiveContainer>
				)}
			</div>
		</AdminCard>
	);
};
