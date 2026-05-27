"use client";

import type { HeatmapDay, HeatmapLevel, HeatmapMonth, HeatmapWeekDay, StatsPeriod } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";

interface HeatmapProps {
	months: HeatmapMonth[];
	weekDays: HeatmapWeekDay[];
	period?: StatsPeriod;
}

const CELL_COLORS = [
	"bg-surf-3",
	"bg-acc/15",
	"bg-acc/30",
	"bg-acc/50",
	"bg-acc/70",
	"bg-acc/90",
] as const;

const LEVEL_TO_COLOR: Record<HeatmapLevel, number> = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 5 };

const CELL = "size-[14px] shrink-0 rounded-[3px] transition-transform hover:scale-125 max-md:size-[11px] max-[480px]:size-[10px]";
const LABEL_COL = "mr-1 w-6 shrink-0 text-right text-[9px] font-medium text-t-3";

const Legend = ({ t }: { t: (k: string) => string }) => (
	<div className="mt-2 flex items-center gap-1" style={{ marginLeft: 32 }}>
		<Typography tag="span" className="mr-0.5 text-[9.5px] text-t-3">{t("statistics.streak.less")}</Typography>
		{CELL_COLORS.map((cls, i) => (
			<div key={i} className={cn("size-[11px] shrink-0 rounded-[2px]", cls)} />
		))}
		<Typography tag="span" className="ml-0.5 text-[9.5px] text-t-3">{t("statistics.streak.more")}</Typography>
	</div>
);

// ─── Week: rows = days, cols = 24 hours ───────────────────────────────────────

const WeekHeatmap = ({ days, t }: { days: HeatmapWeekDay[]; t: (k: string) => string }) => {
	if (days.length === 0) return null;

	return (
		<div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{/* Hour tick labels — shown every 3h, each label left-aligned over its column */}
			<div className="mb-1 flex gap-[3px]" style={{ marginLeft: 32 }}>
				{Array.from({ length: 24 }, (_, h) => (
					<div key={h} className="w-[14px] shrink-0 overflow-visible whitespace-nowrap text-[9px] text-t-3 max-md:w-[11px]">
						{h % 3 === 0 ? `${String(h).padStart(2, "0")}:00` : ""}
					</div>
				))}
			</div>

			{/* Rows = days */}
			{days.map((day) => {
				const labelKey = `statistics.streak.day${day.label}` as Parameters<typeof t>[0];
				const displayLabel = t(labelKey);
				return (
					<div key={day.date} className="mb-[3px] flex items-center gap-[3px]">
						<div className={LABEL_COL}>{displayLabel}</div>
						{day.hours.map((cell) => (
							<div
								key={cell.hour}
								title={`${day.date} ${String(cell.hour).padStart(2, "0")}:00 · ${cell.count}`}
								className={cn(CELL, CELL_COLORS[LEVEL_TO_COLOR[cell.level as HeatmapLevel] ?? 0])}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
};

// ─── Month: GitHub-style rows = Mon–Sun, cols = weeks ────────────────────────

const MonthGridHeatmap = ({ days, t }: { days: HeatmapDay[]; t: (k: string) => string }) => {
	if (days.length === 0) return null;

	const firstDow = (new Date(days[0].date).getDay() + 6) % 7;
	const padded: (HeatmapDay | null)[] = [...Array.from({ length: firstDow }, () => null), ...days];

	const cols: (HeatmapDay | null)[][] = [];
	for (let i = 0; i < padded.length; i += 7) {
		const col = padded.slice(i, i + 7);
		while (col.length < 7) col.push(null);
		cols.push(col);
	}

	// Column labels: just the day number, text overflows naturally
	const colLabels = cols.map((col) => {
		const first = col.find((d) => d !== null);
		return first ? String(new Date(first.date).getUTCDate()) : "";
	});

	const DAY_LABELS = [
		t("statistics.streak.dayMon"),
		t("statistics.streak.dayTue"),
		t("statistics.streak.dayWed"),
		t("statistics.streak.dayThu"),
		t("statistics.streak.dayFri"),
		t("statistics.streak.daySat"),
		t("statistics.streak.daySun"),
	];

	return (
		<div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			{/* Column labels */}
			<div className="mb-1 flex gap-[3px]" style={{ marginLeft: 32 }}>
				{colLabels.map((label, i) => (
					<div key={i} className="w-[14px] shrink-0 text-center text-[9px] text-t-3 max-md:w-[11px]">
						{label}
					</div>
				))}
			</div>

			{/* Rows = weekdays */}
			{Array.from({ length: 7 }, (_, rowIdx) => (
				<div key={rowIdx} className="mb-[3px] flex items-center gap-[3px]">
					<div className={LABEL_COL}>{rowIdx % 2 === 0 ? DAY_LABELS[rowIdx] : ""}</div>
					{cols.map((col, ci) => {
						const day = col[rowIdx];
						return (
							<div
								key={ci}
								title={day ? `${day.date} · ${day.count}` : undefined}
								className={cn(CELL, day ? CELL_COLORS[LEVEL_TO_COLOR[day.level]] : "opacity-0 pointer-events-none")}
							/>
						);
					})}
				</div>
			))}
		</div>
	);
};

// ─── Year / All: classic month rows ──────────────────────────────────────────

const YearHeatmap = ({ months }: { months: HeatmapMonth[] }) => {
	// Sort chronologically by year then month
	const sorted = [...months].sort((a, b) => {
		const dateOf = (m: HeatmapMonth) => m.days[0]?.date ?? "0000-00-00";
		return dateOf(a).localeCompare(dateOf(b));
	});

	// Detect multi-year span to show year dividers
	const years = new Set(sorted.map((m) => m.days[0]?.date.slice(0, 4)));
	const isMultiYear = years.size > 1;

	let lastYear = "";

	return (
		<div className="flex flex-col gap-1">
			{sorted.map((m) => {
				const year = m.days[0]?.date.slice(0, 4) ?? "";
				const showYear = isMultiYear && year !== lastYear;
				lastYear = year;
				return (
					<div key={`${year}-${m.month}`}>
						{showYear && (
							<div className="mb-1 mt-2 text-[9px] font-semibold uppercase tracking-[0.5px] text-t-3 first:mt-0">
								{year}
							</div>
						)}
						<div className="flex min-w-0 items-center gap-1.5">
							<div className="w-[22px] shrink-0 text-[10px] font-medium text-t-3">{m.month}</div>
							<div className="flex min-w-0 flex-wrap gap-[2.5px]">
								{m.days.map((day) => (
									<div
										key={day.date}
										title={`${day.date} · ${day.count}`}
										className={cn(
											"size-[11px] shrink-0 rounded-[2.5px] transition-transform hover:scale-125 max-md:size-[9px] max-[480px]:size-[8px]",
											CELL_COLORS[LEVEL_TO_COLOR[day.level]],
										)}
									/>
								))}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export const Heatmap = ({ months, weekDays, period }: HeatmapProps) => {
	const { t } = useI18n();

	const label =
		period === "week"
			? t("statistics.streak.weekActivity")
			: period === "month"
				? t("statistics.streak.monthActivity")
				: period === "all"
					? t("statistics.streak.allActivity")
					: t("statistics.streak.yearActivity");

	const flatMonthDays = period === "month" ? months.flatMap((m) => m.days) : [];

	return (
		<div className="min-w-0 flex-1">
			<div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.5px] text-t-3">{label}</div>

			{period === "week" && <WeekHeatmap days={weekDays} t={t} />}
			{period === "month" && <MonthGridHeatmap days={flatMonthDays} t={t} />}
			{(period === "year" || period === "all" || !period) && <YearHeatmap months={months} />}

			<Legend t={t} />
		</div>
	);
};
