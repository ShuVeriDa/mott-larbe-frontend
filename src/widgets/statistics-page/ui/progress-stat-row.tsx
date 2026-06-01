"use client";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

interface ProgressStatRowProps {
	label: string;
	value: number;
	colorClass: string;
	textClass: string;
	percent: number;
}

export const ProgressStatRow = ({
	label,
	value,
	colorClass,
	textClass,
	percent,
}: ProgressStatRowProps) => (
	<div className="flex items-center gap-2">
		<span
			className={cn("size-2 shrink-0 rounded-full", colorClass)}
			aria-hidden="true"
		/>
		<Typography tag="span" className="min-w-0 flex-1 text-[11.5px] text-t-2">
			{label}
		</Typography>
		<Typography
			tag="span"
			className={cn("text-[11.5px] font-semibold", textClass)}
		>
			{value.toLocaleString()}
		</Typography>
		<Typography tag="span" className="w-8 text-right text-[10.5px] text-t-3">
			{percent > 0 ? `${Math.round(percent)}%` : "—"}
		</Typography>
	</div>
);
