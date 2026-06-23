"use client";
import { ease, duration } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/cn";
import { motion } from "framer-motion";

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
					<motion.div
						key={seg.key}
						className={cn("h-full", seg.colorClass)}
						initial={{ width: 0 }}
						animate={{ width: `${pct}%` }}
						transition={{ duration: duration.slow, ease: ease.enter, delay: 0.1 }}
					/>
				);
			})}
		</div>
	);
};
