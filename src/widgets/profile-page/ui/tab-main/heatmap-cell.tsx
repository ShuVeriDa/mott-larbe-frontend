"use client";

import type { HeatmapLevel } from "@/entities/statistics";
import { cn } from "@/shared/lib/cn";

const LEVEL_CLASSES: Record<HeatmapLevel, string> = {
	0: "bg-surf-3",
	1: "bg-acc-bg",
	2: "bg-acc/30",
	3: "bg-acc/60",
	4: "bg-acc",
};

export interface HeatmapCellProps {
	level: HeatmapLevel;
	count: number;
	date: string;
}

export const HeatmapCell = ({ level, count, date }: HeatmapCellProps) => (
	<div
		title={count > 0 ? `${date}: ${count}` : date}
		className={cn(
			"size-[10px] rounded-[2px] max-sm:size-[9px] max-[420px]:size-[8px]",
			LEVEL_CLASSES[level],
		)}
	/>
);
