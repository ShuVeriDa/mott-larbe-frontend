"use client";
import { cn } from "@/shared/lib/cn";

export interface ProgressSegmentDef {
	key: string;
	label: string;
	value: number;
	colorClass: string;
	textClass: string;
}

interface ProgressStackedBarProps {
	segments: ProgressSegmentDef[];
	total: number;
}

export const ProgressStackedBar = ({ segments, total }: ProgressStackedBarProps) => {
	const safeTotal = total || 1;
	return (
		<div className="flex h-3 w-full overflow-hidden rounded-full bg-surf-3">
			{segments.map(seg => {
				const pct = (seg.value / safeTotal) * 100;
				if (pct <= 0) return null;
				return (
					<div
						key={seg.key}
						className={cn("h-full transition-[width]", seg.colorClass)}
						style={{ width: `${pct}%` }}
					/>
				);
			})}
		</div>
	);
};
