"use client";

import type { DashboardStreakDay } from "@/entities/dashboard";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { Flame } from "lucide-react";
import Link from "next/link";

interface StreakCalendarProps {
	streakDays: DashboardStreakDay[];
	streak: number;
	streakRecord: number;
	lang: string;
}

export const StreakCalendar = ({ streakDays, streak, streakRecord, lang }: StreakCalendarProps) => {
	const { t } = useI18n();

	if (streakDays.length === 0) return null;

	return (
		<section className="rounded-card border border-bd-1 bg-surf p-4 max-sm:p-3.5">
			<div className="mb-3 flex items-center justify-between gap-3">
				<div className="flex items-center gap-2">
					<StreakFlameIcon />
					<Typography tag="h2" className="text-[13.5px] font-semibold text-t-1">
						{t("dashboard.streak.title")}
					</Typography>
				</div>
				<Link
					href={`/${lang}/progress`}
					className="rounded-sm text-[11.5px] text-acc outline-none transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-acc/70 focus-visible:ring-offset-1"
				>
					{t("dashboard.streak.details")}
				</Link>
			</div>

			<div className="flex items-end gap-1.5">
				{streakDays.map((day) => (
					<StreakDay key={day.date} day={day} />
				))}
			</div>

			<div className="mt-3 flex items-center gap-4 max-sm:gap-3">
				<StreakStat
					value={streak}
					label={t("dashboard.streak.current")}
					colorClass="text-amb-t"
				/>
				<div className="h-6 w-px bg-bd-1" />
				<StreakStat
					value={streakRecord}
					label={t("dashboard.streak.record")}
					colorClass="text-t-2"
				/>
			</div>
		</section>
	);
};

interface StreakDayProps {
	day: DashboardStreakDay;
}

const StreakDay = ({ day }: StreakDayProps) => {
	const isActive = day.active;
	const isToday = day.isToday;

	return (
		<div className="flex flex-1 flex-col items-center gap-1">
			<div
				className={`h-7 w-full max-w-[32px] rounded-[5px] transition-colors ${
					isActive
						? "bg-amb"
						: isToday
							? "border border-bd-2 bg-surf-2"
							: "bg-surf-2"
				}`}
				title={day.date}
			/>
			<Typography
				tag="span"
				className={`text-[10px] ${isToday ? "font-semibold text-t-1" : "text-t-2"}`}
			>
				{day.label}
			</Typography>
		</div>
	);
};

interface StreakStatProps {
	value: number;
	label: string;
	colorClass: string;
}

const StreakStat = ({ value, label, colorClass }: StreakStatProps) => (
	<div className="flex items-baseline gap-1.5">
		<Typography tag="span" className={`text-[22px] font-bold leading-none ${colorClass}`}>
			{value}
		</Typography>
		<Typography tag="span" className="text-[11px] text-t-2">
			{label}
		</Typography>
	</div>
);

const StreakFlameIcon = () => (
	<Flame className="size-[14px] text-amb-t" aria-hidden="true" />
);
