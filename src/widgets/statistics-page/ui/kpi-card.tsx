"use client";

import type { StatsDelta } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { TrendingDown, TrendingUp } from "lucide-react";
import { type ReactNode } from "react";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const TONE_BG: Record<KpiCardProps["tone"], string> = {
	acc: "bg-acc-bg text-acc",
	grn: "bg-grn-bg text-grn",
	amb: "bg-amb-bg text-amb",
	pur: "bg-pur-bg text-pur",
};

const TONE_STROKE: Record<KpiCardProps["tone"], string> = {
	acc: "var(--acc)",
	grn: "var(--grn)",
	amb: "var(--amb)",
	pur: "var(--pur)",
};

export interface KpiCardProps {
	label: string;
	value: string;
	delta: StatsDelta;
	tone: "acc" | "grn" | "amb" | "pur";
	icon: ReactNode;
	sparkline: number[];
}

export const KpiCard = ({ label, value, delta, tone, icon, sparkline }: KpiCardProps) => {
	const { t } = useI18n();

	const trendKey =
		delta.delta === null || delta.delta === 0
			? "statistics.kpi.deltaZero"
			: delta.delta > 0
				? "statistics.kpi.deltaPositive"
				: "statistics.kpi.deltaNegative";

	const trendValue =
		delta.delta === null
			? null
			: delta.delta === 0
				? t(trendKey)
				: t(trendKey, { n: Math.abs(delta.delta) });

	const trendColor =
		delta.delta === null || delta.delta === 0
			? "text-t-3"
			: delta.delta > 0
				? "text-grn"
				: "text-red";

	const sparkData = sparkline.map((v, i) => ({ i, v }));
	const hasActivity = sparkline.some((v) => v > 0);

	return (
		<div className="rounded-card border-[0.5px] border-bd-1 bg-surf p-3.5 transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-bd-2 hover:shadow-md [@media(hover:hover)]:hover:-translate-y-0.5">
			<div className="mb-2 flex items-start justify-between">
				<div
					className={cn("flex size-7 items-center justify-center rounded-base", TONE_BG[tone])}
					aria-hidden="true"
				>
					{icon}
				</div>
				{hasActivity && (
					<div className="h-8 w-16 opacity-60" role="img" aria-label={label}>
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={sparkData}>
								<Line
									type="monotone"
									dataKey="v"
									stroke={TONE_STROKE[tone]}
									strokeWidth={1.5}
									dot={false}
									isAnimationActive={false}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				)}
			</div>
			<Typography tag="p" className="mb-1 font-display text-2xl leading-none tracking-[-0.3px] text-t-1">
				{value}
			</Typography>
			<Typography tag="p" className="text-[11px] leading-snug text-t-3">
				{label}
			</Typography>
			{trendValue ? (
				<Typography
					tag="p"
					className={cn("mt-1.5 flex items-center gap-[3px] text-[11px] font-medium", trendColor)}
				>
					{delta.delta && delta.delta > 0 ? (
						<TrendingUp className="size-2.5" aria-hidden="true" />
					) : delta.delta && delta.delta < 0 ? (
						<TrendingDown className="size-2.5" aria-hidden="true" />
					) : null}
					{trendValue}
				</Typography>
			) : null}
		</div>
	);
};
