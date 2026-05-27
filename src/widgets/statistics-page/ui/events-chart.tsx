"use client";

import type { UserEventsChart } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
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

interface EventsChartProps {
	chart: UserEventsChart;
}

export const EventsChart = ({ chart }: EventsChartProps) => {
	const { t } = useI18n();

	const data = chart.labels.map((label, i) => ({
		label,
		openText: chart.series.openText[i] ?? 0,
		addToDict: chart.series.addToDict[i] ?? 0,
		reviewSession: chart.series.reviewSession[i] ?? 0,
	}));

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 flex flex-wrap items-center justify-between gap-1">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.eventsChart.title")}
				</Typography>
				<div className="flex flex-wrap items-center gap-3">
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<span className="inline-block size-2 rounded-[2px] bg-acc/70" aria-hidden="true" />
						{t("statistics.eventsChart.openText")}
					</div>
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<span className="inline-block size-2 rounded-full bg-grn" aria-hidden="true" />
						{t("statistics.eventsChart.addToDict")}
					</div>
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<span className="inline-block size-2 rounded-full bg-pur" aria-hidden="true" />
						{t("statistics.eventsChart.reviewSession")}
					</div>
				</div>
			</header>

			{data.length === 0 ? (
				<div className="flex h-[160px] items-center justify-center text-[11px] text-t-3">
					{t("statistics.eventsChart.empty")}
				</div>
			) : (
				<ResponsiveContainer width="100%" height={160}>
					<ComposedChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
						<CartesianGrid strokeDasharray="0" stroke="var(--bd-1)" vertical={false} />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
							interval="preserveStartEnd"
						/>
						<YAxis
							yAxisId="left"
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							yAxisId="right"
							orientation="right"
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
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
							dataKey="openText"
							name={t("statistics.eventsChart.openText")}
							fill="var(--acc)"
							fillOpacity={0.7}
							radius={[3, 3, 0, 0]}
							maxBarSize={16}
						/>
						<Line
							yAxisId="right"
							dataKey="addToDict"
							name={t("statistics.eventsChart.addToDict")}
							stroke="var(--grn)"
							strokeWidth={1.5}
							dot={{ r: 2, fill: "var(--grn)" }}
							activeDot={{ r: 4 }}
							type="monotone"
						/>
						<Line
							yAxisId="left"
							dataKey="reviewSession"
							name={t("statistics.eventsChart.reviewSession")}
							stroke="var(--pur)"
							strokeWidth={1.5}
							dot={{ r: 2, fill: "var(--pur)" }}
							activeDot={{ r: 4 }}
							type="monotone"
						/>
					</ComposedChart>
				</ResponsiveContainer>
			)}
		</section>
	);
};
