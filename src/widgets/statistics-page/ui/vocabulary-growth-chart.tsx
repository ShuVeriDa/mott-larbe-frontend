"use client";

import type { StatsPeriod, VocabularyGrowthPoint } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import {
	Area,
	Bar,
	CartesianGrid,
	ComposedChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface VocabularyGrowthChartProps {
	points: VocabularyGrowthPoint[];
	period?: StatsPeriod;
}

const formatLabel = (date: string, period?: StatsPeriod, lang?: string): string => {
	const d = new Date(date);
	if (period === "year" || period === "all") {
		return new Intl.DateTimeFormat(lang ?? "ru", { month: "short", timeZone: "UTC" }).format(d);
	}
	return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

export const VocabularyGrowthChart = ({ points, period }: VocabularyGrowthChartProps) => {
	const { t, lang } = useI18n();

	const data = points.map((p) => ({
		label: formatLabel(p.date, period, lang),
		total: p.total,
		added: p.added,
	}));

	const isEmpty = points.every((p) => p.total === 0);

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 flex flex-wrap items-center justify-between gap-1">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.vocabGrowth.title")}
				</Typography>
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<span className="inline-block size-2 rounded-[2px] bg-acc/50" aria-hidden="true" />
						{t("statistics.vocabGrowth.total")}
					</div>
					<div className="flex items-center gap-1.5 text-[11px] text-t-3">
						<span className="inline-block size-2 rounded-[2px] bg-grn" aria-hidden="true" />
						{t("statistics.vocabGrowth.added")}
					</div>
				</div>
			</header>

			{isEmpty ? (
				<div className="flex h-[160px] items-center justify-center text-[11px] text-t-3">
					{t("statistics.vocabGrowth.empty")}
				</div>
			) : (
				<ResponsiveContainer width="100%" height={160}>
					<ComposedChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
						<defs>
							<linearGradient id="vocabGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--acc)" stopOpacity={0.25} />
								<stop offset="95%" stopColor="var(--acc)" stopOpacity={0.02} />
							</linearGradient>
						</defs>
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
						<Area
							yAxisId="left"
							dataKey="total"
							name={t("statistics.vocabGrowth.total")}
							stroke="var(--acc)"
							strokeWidth={1.5}
							fill="url(#vocabGradient)"
							dot={false}
							activeDot={{ r: 4, fill: "var(--acc)" }}
							type="monotone"
						/>
						<Bar
							yAxisId="right"
							dataKey="added"
							name={t("statistics.vocabGrowth.added")}
							fill="var(--grn)"
							radius={[3, 3, 0, 0]}
							maxBarSize={14}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			)}
		</section>
	);
};
