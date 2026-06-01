"use client";
import { Typography } from "@/shared/ui/typography";

interface WordLegendRowProps {
	label: string;
	value: number;
	colorClass: string;
	percent: number;
}

export const WordLegendRow = ({ label, value, colorClass, percent }: WordLegendRowProps) => (
	<div>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-1.5 text-[11.5px] text-t-2">
				<Typography tag="span" className={`size-2 shrink-0 rounded-full ${colorClass}`} />
				{label}
			</div>
			<Typography tag="span" className="text-xs font-semibold text-t-1">
				{value.toLocaleString()}
			</Typography>
		</div>
		<div className="mt-0.5 h-[3px] overflow-hidden rounded-[2px] bg-surf-3">
			<div
				className={`h-full rounded-[2px] ${colorClass}`}
				style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
			/>
		</div>
	</div>
);
