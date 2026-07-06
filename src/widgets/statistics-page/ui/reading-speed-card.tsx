"use client";
import type { ReadingSpeedData } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface ReadingSpeedCardProps {
	data: ReadingSpeedData;
}

const formatDate = (date: string): string => {
	const d = new Date(date);
	return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
};

export const ReadingSpeedCard = ({ data }: ReadingSpeedCardProps) => {
	const { t } = useI18n();
	const isEmpty = data.points.length === 0;
	const chartData = data.points.map(p => ({
		label: formatDate(p.date),
		wpm: p.wpm,
	}));

	return (
		<section className="h-full rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 gap-1 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.readingSpeed.title")}
				</Typography>
				{!isEmpty && (
					<div className="flex items-center gap-3">
						<div className="text-right">
							<Typography tag="p" className="text-[10px] text-t-3">
								{t("statistics.readingSpeed.avg")}
							</Typography>
							<Typography
								tag="p"
								className="text-[12px] font-semibold text-t-1"
							>
								{data.avg} {t("statistics.readingSpeed.wpm")}
							</Typography>
						</div>
						<div className="text-right">
							<Typography tag="p" className="text-[10px] text-t-3">
								{t("statistics.readingSpeed.best")}
							</Typography>
							<Typography
								tag="p"
								className="text-[12px] font-semibold text-grn"
							>
								{data.best} {t("statistics.readingSpeed.wpm")}
							</Typography>
						</div>
					</div>
				)}
			</header>

			{isEmpty ? (
				<div className="flex h-[120px] items-center justify-center text-[11px] text-t-3">
					{t("statistics.readingSpeed.empty")}
				</div>
			) : (
				<ResponsiveContainer width="100%" height={120}>
					<AreaChart
						data={chartData}
						margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
					>
						<defs>
							<linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--grn)" stopOpacity={0.3} />
								<stop offset="95%" stopColor="var(--grn)" stopOpacity={0.02} />
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="0"
							stroke="var(--bd-1)"
							vertical={false}
						/>
						<XAxis
							dataKey="label"
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
							interval="preserveStartEnd"
						/>
						<YAxis
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
							allowDecimals={false}
						/>
						{data.avg > 0 && (
							<ReferenceLine
								y={data.avg}
								stroke="var(--t-3)"
								strokeDasharray="4 3"
								strokeWidth={1}
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
							cursor={{ stroke: "var(--bd-2)", strokeWidth: 1 }}
							formatter={(v) => [
								`${v ?? 0} ${t("statistics.readingSpeed.wpm")}`,
								"",
							]}
						/>
						<Area
							dataKey="wpm"
							name={t("statistics.readingSpeed.wpm")}
							stroke="var(--grn)"
							strokeWidth={1.5}
							fill="url(#speedGrad)"
							dot={false}
							activeDot={{ r: 4, fill: "var(--grn)" }}
							type="monotone"
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</section>
	);
};
