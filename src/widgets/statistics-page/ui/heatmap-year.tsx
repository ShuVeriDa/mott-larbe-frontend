"use client";
import type { HeatmapLevel, HeatmapMonth } from "@/entities/statistics";
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

interface HeatmapYearProps {
	months: HeatmapMonth[];
}

export const HeatmapYear = ({ months }: HeatmapYearProps) => {
	const sorted = [...months].sort((a, b) => {
		const dateOf = (m: HeatmapMonth) => m.days[0]?.date ?? "0000-00-00";
		return dateOf(a).localeCompare(dateOf(b));
	});

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
											"size-[11px] shrink-0 rounded-[2.5px] transition-transform hover:scale-125 motion-reduce:hover:scale-100 max-md:size-[9px] max-[480px]:size-[8px]",
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
