"use client";
import type { HeatmapDay, HeatmapLevel } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";

const CELL_COLORS = [
	"bg-surf-3",
	"bg-acc/15",
	"bg-acc/30",
	"bg-acc/50",
	"bg-acc/70",
	"bg-acc/90",
] as const;

const LEVEL_TO_COLOR: Record<HeatmapLevel, number> = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 5 };

const CELL = "size-[14px] shrink-0 rounded-[3px] transition-transform hover:scale-125 motion-reduce:hover:scale-100 max-md:size-[11px] max-[480px]:size-[10px]";
const LABEL_COL = "mr-1 w-6 shrink-0 text-right text-[9px] font-medium text-t-3";

interface HeatmapMonthGridProps {
	days: HeatmapDay[];
	t: (k: string) => string;
}

export const HeatmapMonthGrid = ({ days, t }: HeatmapMonthGridProps) => {
	if (days.length === 0) return null;

	const firstDow = (new Date(days[0].date).getDay() + 6) % 7;
	const padded: (HeatmapDay | null)[] = [...Array.from({ length: firstDow }, () => null), ...days];

	const cols: (HeatmapDay | null)[][] = [];
	for (let i = 0; i < padded.length; i += 7) {
		const col = padded.slice(i, i + 7);
		while (col.length < 7) col.push(null);
		cols.push(col);
	}

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
			<div className="mb-1 flex gap-[3px]" style={{ marginLeft: 32 }}>
				{colLabels.map((label, i) => (
					<div key={i} className="w-[14px] shrink-0 text-center text-[9px] text-t-3 max-md:w-[11px]">
						{label}
					</div>
				))}
			</div>

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
