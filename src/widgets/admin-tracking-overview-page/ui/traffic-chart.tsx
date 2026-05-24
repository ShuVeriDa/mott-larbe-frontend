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
import type { AnalyticsTimeseriesPoint } from "@/features/admin-analytics";
import { formatNumber } from "../lib/format";

interface TrafficChartProps {
	pageviews: AnalyticsTimeseriesPoint[] | undefined;
	visitors: AnalyticsTimeseriesPoint[] | undefined;
	loading: boolean;
	labelPageviews: string;
	labelVisitors: string;
}

const formatDate = (d: string) => {
	const date = new Date(d);
	return `${date.getDate()} ${["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек"][date.getMonth()]}`;
};

export const TrafficChart = ({
	pageviews,
	visitors,
	loading,
	labelPageviews,
	labelVisitors,
}: TrafficChartProps) => {
	if (loading) {
		return <div className="h-[190px] animate-pulse rounded-lg bg-surf-2" />;
	}

	const data = (pageviews ?? []).map((p, i) => ({
		label: formatDate(p.date),
		pageviews: p.value,
		visitors: visitors?.[i]?.value ?? 0,
	}));

	return (
		<div className="flex flex-wrap items-center gap-2.5 mb-2">
			<div className="flex items-center gap-1.5 text-[11px] text-t-3">
				<span className="inline-block size-2 rounded-[2px] bg-acc/70" />
				{labelPageviews}
			</div>
			<div className="flex items-center gap-1.5 text-[11px] text-t-3">
				<span className="inline-block size-2 rounded-full bg-grn" />
				{labelVisitors}
			</div>
			<div className="w-full">
				<ResponsiveContainer width="100%" height={190}>
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
							tickFormatter={(v) => formatNumber(Number(v))}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							tick={{ fontSize: 11, fill: "var(--t-3)" }}
							tickLine={false}
							axisLine={false}
							tickFormatter={(v) => formatNumber(Number(v))}
						/>
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
						/>
						<Bar
							yAxisId="left"
							dataKey="pageviews"
							name={labelPageviews}
							fill="var(--acc)"
							fillOpacity={0.7}
							radius={[3, 3, 0, 0]}
							maxBarSize={18}
						/>
						<Line
							yAxisId="right"
							dataKey="visitors"
							name={labelVisitors}
							stroke="var(--grn)"
							strokeWidth={1.5}
							dot={{ r: 3, fill: "var(--grn)", strokeWidth: 0 }}
							activeDot={{ r: 5 }}
							type="monotone"
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};
