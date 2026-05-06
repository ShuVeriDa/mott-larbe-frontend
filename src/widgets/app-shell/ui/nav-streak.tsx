"use client";

import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import type { DashboardStats } from "@/entities/dashboard";

interface NavStreakProps {
	stats: Pick<DashboardStats, "streak" | "streakRecord" | "streakDays">;
}

export const NavStreak = ({ stats }: NavStreakProps) => {
	const { t } = useI18n();

	return (
		<div className="px-3.5 pb-2.5 pt-1.5">
			<div className="mb-2 flex items-center justify-between">
				<span className="text-[10px] font-semibold uppercase tracking-[0.7px] text-t-3">
					{t("nav.streak")}
				</span>
				<span className="font-display text-[17px] font-normal leading-none text-amb">
					{stats.streak}
				</span>
			</div>

			<div className="mb-1.5 flex items-end gap-[3px]">
				{stats.streakDays.map((day) => (
					<div
						key={day.date}
						className="flex flex-1 flex-col items-center gap-[3px]"
					>
						<div
							className={cn(
								"w-full rounded-[2.5px] h-[11px] transition-colors",
								day.active ? "bg-amb" : "bg-surf-3",
								day.isToday && !day.active
									? "outline outline-1 outline-offset-[1px] outline-amb"
									: "",
							)}
						/>
						<span
							className={cn(
								"text-[8.5px] leading-none",
								day.isToday ? "text-amb" : "text-t-3",
							)}
						>
							{day.label}
						</span>
					</div>
				))}
			</div>

			<div className="text-[10px] text-t-3">
				{t("nav.streakRecord", { days: stats.streakRecord })}
			</div>
		</div>
	);
};
