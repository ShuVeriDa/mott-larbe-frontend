"use client";
import type { RetentionData } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface RetentionCardProps {
	data: RetentionData;
}

const LEVEL_CONFIG = {
	NEW:      { colorClass: "bg-amb/70",  stroke: "var(--amb)",  labelKey: "statistics.retention.new" },
	LEARNING: { colorClass: "bg-acc/70",  stroke: "var(--acc)",  labelKey: "statistics.retention.learning" },
	KNOWN:    { colorClass: "bg-grn",     stroke: "var(--grn)",  labelKey: "statistics.retention.known" },
};

export const RetentionCard = ({ data }: RetentionCardProps) => {
	const { t } = useI18n();

	const chartData = data.levels
		.filter(l => l.count > 0)
		.map(l => ({
			name: t(LEVEL_CONFIG[l.level as keyof typeof LEVEL_CONFIG]?.labelKey ?? ""),
			value: l.count,
			stroke: LEVEL_CONFIG[l.level as keyof typeof LEVEL_CONFIG]?.stroke ?? "var(--t-3)",
		}));

	const isEmpty = data.total === 0;

	return (
		<section className="rounded-card border-[0.5px] border-bd-1 bg-surf p-4 transition-colors">
			<header className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[12.5px] font-semibold text-t-1">
					{t("statistics.retention.title")}
				</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
					{data.total.toLocaleString()} {t("statistics.retention.words")}
				</Typography>
			</header>

			{isEmpty ? (
				<div className="flex h-[120px] items-center justify-center text-[11px] text-t-3">
					{t("statistics.retention.empty")}
				</div>
			) : (
				<div className="flex items-center gap-4">
					<div className="size-[100px] shrink-0">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={chartData}
									cx="50%"
									cy="50%"
									innerRadius={28}
									outerRadius={46}
									dataKey="value"
									strokeWidth={0}
								>
									{chartData.map((entry, idx) => (
										<Cell key={idx} fill={entry.stroke} fillOpacity={0.85} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										background: "var(--surf)",
										border: "0.5px solid var(--bd-2)",
										borderRadius: 8,
										fontSize: 12,
										color: "var(--t-1)",
									}}
									formatter={(v: number) => [v.toLocaleString(), ""]}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>

					<div className="flex flex-1 flex-col gap-2">
						{data.levels.map(l => {
							const cfg = LEVEL_CONFIG[l.level as keyof typeof LEVEL_CONFIG];
							const pct = data.total > 0 ? Math.round((l.count / data.total) * 100) : 0;
							return (
								<div key={l.level}>
									<div className="mb-0.5 flex items-center justify-between text-[11px]">
										<div className="flex items-center gap-1.5">
											<span className={cn("size-2 shrink-0 rounded-full", cfg?.colorClass ?? "bg-surf-3")} />
											<Typography tag="span" className="text-t-2">{t(cfg?.labelKey ?? "")}</Typography>
										</div>
										<Typography tag="span" className="font-semibold text-t-1">
											{l.count.toLocaleString()}
										</Typography>
									</div>
									<div className="h-1 overflow-hidden rounded-full bg-surf-3">
										<div
											className={cn("h-full rounded-full transition-[width]", cfg?.colorClass ?? "bg-surf-3")}
											style={{ width: `${pct}%` }}
										/>
									</div>
								</div>
							);
						})}
						{data.dueForReview > 0 && (
							<div className="mt-1 rounded-md bg-amb-bg px-2.5 py-1.5">
								<Typography tag="p" className="text-[11px] font-medium text-amb-t">
									{t("statistics.retention.due", { n: data.dueForReview })}
								</Typography>
							</div>
						)}
					</div>
				</div>
			)}
		</section>
	);
};
