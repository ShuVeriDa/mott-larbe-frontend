"use client";

import type { HeatmapMonth, StreakInfo } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { Heatmap } from "./heatmap";

interface StreakBlockProps {
	streak: StreakInfo;
	heatmap: HeatmapMonth[];
}

export const StreakBlock = ({ streak, heatmap }: StreakBlockProps) => {
	const { t } = useI18n();

	return (
		<section className="flex items-start gap-6 rounded-card border-hairline border-bd-1 bg-surf p-4 max-md:flex-col max-md:gap-3.5">
			<div className="shrink-0 max-md:w-full">
				<div className="mb-1 flex items-center gap-2">
					<Typography
						tag="span"
						className="font-display text-[42px] font-normal leading-none tracking-[-0.5px] text-amb"
					>
						{streak.current}
					</Typography>
					<span className="text-[26px] leading-none" aria-hidden="true">
						🔥
					</span>
				</div>
				<Typography tag="p" className="mb-0.5 text-xs font-semibold text-t-2">
					{t("statistics.streak.daysInRow")}
				</Typography>
				<Typography tag="p" className="text-[11px] text-t-3">
					{t("statistics.streak.record", { n: streak.record })}
				</Typography>

				<div className="mt-3 flex gap-2 overflow-x-auto pb-1 max-[480px]:overflow-x-auto">
					{streak.milestones.map((ms) => (
						<div
							key={ms.days}
							className={cn(
								"flex min-w-[52px] shrink-0 flex-col items-center gap-0.5 rounded-lg border-hairline border-bd-1 px-2.5 py-1.5",
								ms.reached
									? "border-amb/20 bg-amb-bg"
									: "bg-surf-2",
							)}
						>
							<Typography
								tag="span"
								className={cn(
									"text-[13px] font-semibold",
									ms.reached ? "text-amb-t" : "text-t-3",
								)}
							>
								{ms.days}
							</Typography>
							<Typography
								tag="span"
								className="text-center text-[9px] font-medium text-t-3"
							>
								{t("statistics.streak.milestoneDays", { n: ms.days })}
							</Typography>
						</div>
					))}
				</div>
			</div>

			<div className="w-px shrink-0 self-stretch bg-bd-1 max-md:hidden" />

			<Heatmap months={heatmap} />
		</section>
	);
};
