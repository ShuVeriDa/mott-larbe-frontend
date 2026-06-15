"use client";

import {
	ResponsiveContainer,
	ComposedChart,
	Bar,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";
import type { AnalyticsMetric } from "@/features/admin-analytics";
import { formatNumber, formatDuration, formatPercent } from "./format";
import { formatDateCompact } from "@/shared/lib/format-date";

interface Point {
	date: string;
	value: number;
}

interface TimeseriesChartProps {
	current: Point[];
	previous?: Point[];
	metric: AnalyticsMetric;
	labelCurrent: string;
	labelPrevious: string;
}

const formatMetric = (metric: AnalyticsMetric, v: number): string => {
	if (metric === "avgSessionSec") return formatDuration(v);
	if (metric === "bounceRate") return formatPercent(v);
	return formatNumber(v);
};

export const TimeseriesChart = ({ current, previous, metric, labelCurrent, labelPrevious }: TimeseriesChartProps) => {
	const data = current.map((p, i) => ({
		label: formatDateCompact(p.date),
		current: p.value,
		...(previous?.[i] ? { previous: previous[i].value } : {}),
	}));

	return (
		<div>
			<div className="flex flex-wrap items-center gap-2.5 mb-2">
				<div className="flex items-center gap-1.5 text-[11px] text-t-3">
					<span className="inline-block size-2 rounded-[2px] bg-acc/70" />
					{labelCurrent}
				</div>
				{previous && (
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<span className="inline-block size-2 rounded-full bg-grn" />
						{labelPrevious}
					</div>
				)}
			</div>

			<ResponsiveContainer width="100%" height={300}>
				<ComposedChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
					<CartesianGrid vertical={false} stroke="var(--bd-1)" />
					<XAxis
						dataKey="label"
						tick={{ fontSize: 11, fill: "var(--t-3)" }}
						tickLine={false}
						axisLine={false}
						interval="equidistantPreserveStart"
					/>
					<YAxis
						yAxisId="left"
						tick={{ fontSize: 11, fill: "var(--t-3)" }}
						tickLine={false}
						axisLine={false}
						tickFormatter={(v) => formatMetric(metric, Number(v))}
					/>
					{previous && (
						<YAxis
							yAxisId="right"
							orientation="right"
							tick={{ fontSize: 11, fill: "var(--t-3)" }}
							tickLine={false}
							axisLine={false}
							tickFormatter={(v) => formatMetric(metric, Number(v))}
						/>
					)}
					<Tooltip
						contentStyle={{
							background: "var(--surf)",
							border: "0.5px solid var(--bd-2)",
							borderRadius: 8,
							fontSize: 12,
							color: "var(--t-1)",
						}}
						labelStyle={{ color: "var(--t-3)", fontSize: 11 }}
						cursor={{ fill: "var(--surf-2)" }}
						formatter={(v) => [formatMetric(metric, Number(v))]}
					/>
					<Bar
						yAxisId="left"
						dataKey="current"
						name={labelCurrent}
						fill="var(--acc)"
						fillOpacity={0.7}
						radius={[3, 3, 0, 0]}
						maxBarSize={18}
					/>
					{previous && (
						<Line
							yAxisId="right"
							dataKey="previous"
							name={labelPrevious}
							stroke="var(--grn)"
							strokeWidth={1.5}
							dot={{ r: 3, fill: "var(--grn)", strokeWidth: 0 }}
							activeDot={{ r: 5 }}
							type="monotone"
						/>
					)}
				</ComposedChart>
			</ResponsiveContainer>
		</div>
	);
};
