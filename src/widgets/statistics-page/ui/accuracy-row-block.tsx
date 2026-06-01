"use client";
import { Typography } from "@/shared/ui/typography";

export interface AccuracyRowBlockProps {
	label: string;
	value: string | number;
	dotColor?: string;
	statColor?: string;
	percent?: number;
	barColor?: string;
}

export const AccuracyRowBlock = ({
	label,
	value,
	dotColor,
	statColor,
	percent,
	barColor,
}: AccuracyRowBlockProps) => (
	<div>
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-1.5 text-xs text-t-2">
				{dotColor ? (
					<Typography tag="span" className={`size-[7px] rounded-full ${dotColor}`} />
				) : null}
				{label}
			</div>
			<Typography tag="span" className={`text-xs font-semibold ${statColor ?? "text-t-1"}`}>
				{value}
			</Typography>
		</div>
		{typeof percent === "number" && barColor ? (
			<div className="mt-1 h-1 overflow-hidden rounded-[2px] bg-surf-3">
				<div
					className={`h-full rounded-[2px] ${barColor}`}
					style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
				/>
			</div>
		) : null}
	</div>
);
