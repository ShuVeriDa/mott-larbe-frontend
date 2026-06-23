"use client";

import type { HeatmapMonth, HeatmapWeekDay, StatsPeriod, StreakInfo } from "@/entities/statistics";
import { spring, variants } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { motion } from "framer-motion";
import { Heatmap } from "./heatmap";

interface StreakBlockProps {
	streak: StreakInfo;
	heatmap: HeatmapMonth[];
	heatmapWeek: HeatmapWeekDay[];
	period?: StatsPeriod;
}

export const StreakBlock = ({ streak, heatmap, heatmapWeek, period }: StreakBlockProps) => {
	const { t } = useI18n();

	return (
		<section className="flex items-start gap-6 rounded-card border-[0.5px] border-bd-1 bg-surf p-4 max-md:flex-col max-md:gap-3.5">
			<div className="shrink-0 max-md:w-full">
				<motion.div
					className="mb-1 flex items-center gap-2"
					initial={{ opacity: 0, scale: 0.7 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={spring.bouncy}
				>
					<Typography
						tag="span"
						className="font-display text-[42px] font-normal leading-none tracking-[-0.5px] text-amb"
					>
						{streak.current}
					</Typography>
					<Typography
						tag="span"
						className="text-[26px] leading-none"
						aria-hidden="true"
					>
						🔥
					</Typography>
				</motion.div>
				<Typography tag="p" className="mb-0.5 text-xs font-semibold text-t-2">
					{t("statistics.streak.daysInRow")}
				</Typography>
				<Typography tag="p" className="text-[11px] text-t-3">
					{t("statistics.streak.record", { n: streak.record })}
				</Typography>

				<motion.div
					className="mt-3 grid grid-cols-4 gap-2 max-[360px]:gap-1.5"
					variants={variants.staggerContainer}
					initial="hidden"
					animate="visible"
				>
					{streak.milestones.map(ms => (
						<motion.div
							key={ms.days}
							variants={variants.staggerItem}
							className={cn(
								"flex flex-col items-center gap-0.5 rounded-lg border-[0.5px] border-bd-1 px-2 py-1.5 transition-colors",
								ms.reached ? "border-amb/20 bg-amb-bg" : "bg-surf-2",
							)}
						>
							<Typography
								tag="span"
								className={cn(
									"text-[13px] font-semibold max-[360px]:text-[12px]",
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
						</motion.div>
					))}
				</motion.div>
			</div>

			<div className="w-px shrink-0 self-stretch bg-bd-1 max-md:hidden" />

			<Heatmap months={heatmap} weekDays={heatmapWeek} period={period} />
		</section>
	);
};
