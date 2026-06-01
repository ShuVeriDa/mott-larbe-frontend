"use client";

import type { DashboardStreakDay } from "@/entities/dashboard";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
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
					className="text-[11.5px] text-acc transition-colors hover:underline"
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
				className={`text-[10px] ${isToday ? "font-semibold text-t-1" : "text-t-3"}`}
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
		<Typography tag="span" className="text-[11px] text-t-3">
			{label}
		</Typography>
	</div>
);

const StreakFlameIcon = () => (
	<svg
		viewBox="0 0 14 14"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.3"
		className="size-[14px] text-amb-t"
		aria-hidden="true"
	>
		<path
			d="M7 1.5C7 1.5 9.5 4 9.5 6.5C9.5 8 8.4 9 7 9C5.6 9 4.5 8 4.5 6.5C4.5 5.5 5 4.5 5 4.5C5 4.5 4 6 4.5 7C3.5 6.5 3 5.5 3 4.5C3 6.5 4.5 8.5 4.5 10C4.5 11.4 5.6 12.5 7 12.5C8.4 12.5 9.5 11.4 9.5 10C9.5 8 11 6 7 1.5Z"
			strokeLinejoin="round"
		/>
	</svg>
);
