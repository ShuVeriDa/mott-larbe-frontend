"use client";
import type { HeatmapLevel, HeatmapWeekDay } from "@/entities/statistics";
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

interface HeatmapWeekProps {
	days: HeatmapWeekDay[];
	t: (k: string) => string;
}

export const HeatmapWeek = ({ days, t }: HeatmapWeekProps) => {
	if (days.length === 0) return null;

	return (
		<div className="overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
			<div className="mb-1 flex gap-[3px]" style={{ marginLeft: 32 }}>
				{Array.from({ length: 24 }, (_, h) => (
					<div key={h} className="w-[14px] shrink-0 overflow-visible whitespace-nowrap text-[9px] text-t-3 max-md:w-[11px]">
						{h % 3 === 0 ? `${String(h).padStart(2, "0")}:00` : ""}
					</div>
				))}
			</div>

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
