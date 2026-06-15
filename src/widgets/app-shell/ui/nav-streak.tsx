"use client";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";

import type { DashboardStats } from "@/entities/dashboard";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

interface NavStreakProps {
	stats: Pick<DashboardStats, "streak" | "streakRecord" | "streakDays">;
}

export const NavStreak = ({ stats }: NavStreakProps) => {
	const { t } = useI18n();

	return (
		<div className="px-3.5 pb-2.5 pt-1.5">
			<div className="mb-2 flex items-center justify-between">
				<SectionLabel className="mb-0">
					{t("nav.streak")}
				</SectionLabel>
				<Typography
					tag="span"
					className="font-display text-[17px] font-normal leading-none text-amb"
				>
					{stats.streak}
				</Typography>
			</div>

			<div className="mb-1 flex flex-wrap gap-[3px]">
				{stats.streakDays.map(day => (
					<div
						key={day.date}
						className={cn(
							"w-5.5 h-5.5 rounded-[5px] flex items-center justify-center px-2 py-1 text-[9px] font-semibold leading-none transition-colors",
							day.active ? "bg-acc text-white" : "bg-acc-bg text-acc-t",
							day.isToday && !day.active ? "ring-1 ring-amb" : "",
						)}
					>
						{day.label}
					</div>
				))}
			</div>

			<div className="text-[10px] text-t-3">
				{t("nav.streakRecord", { days: stats.streakRecord })}
			</div>
		</div>
	);
};
