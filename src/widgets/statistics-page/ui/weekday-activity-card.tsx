"use client";
import type { WeekdayPoint } from "@/entities/statistics";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import {
	Area,
	AreaChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface WeekdayActivityCardProps {
	data: WeekdayPoint[];
}

export const WeekdayActivityCard = ({ data }: WeekdayActivityCardProps) => {
	const { t } = useI18n();
	const isEmpty = data.every(d => d.total === 0);

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.weekday.title")}
				</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
					{t("statistics.weekday.sub")}
				</Typography>
			</header>

			{isEmpty ? (
				<div className="flex h-[160px] items-center justify-center text-[11px] text-t-3">
					{t("statistics.weekday.empty")}
				</div>
			) : (
				<ResponsiveContainer width="100%" height={160}>
					<AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
						<defs>
							<linearGradient id="weekdayGrad" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor="var(--acc)" stopOpacity={0.3} />
								<stop offset="95%" stopColor="var(--acc)" stopOpacity={0.02} />
							</linearGradient>
						</defs>
						<CartesianGrid strokeDasharray="0" stroke="var(--bd-1)" vertical={false} />
						<XAxis
							dataKey="label"
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							tick={{ fontSize: 10, fill: "var(--t-3)" }}
							axisLine={false}
							tickLine={false}
							allowDecimals={false}
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
							cursor={{ stroke: "var(--bd-2)", strokeWidth: 1 }}
						/>
						<Area
							dataKey="avg"
							name={t("statistics.weekday.sub")}
							stroke="var(--acc)"
							strokeWidth={1.5}
							fill="url(#weekdayGrad)"
							dot={false}
							activeDot={{ r: 4, fill: "var(--acc)" }}
							type="monotone"
						/>
					</AreaChart>
				</ResponsiveContainer>
			)}
		</section>
	);
};
