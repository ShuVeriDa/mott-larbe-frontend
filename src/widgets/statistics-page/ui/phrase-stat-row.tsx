"use client";
import { Typography } from "@/shared/ui/typography";

interface PhraseStatRowProps {
	label: string;
	value: number;
	dotColor: string;
}

export const PhraseStatRow = ({ label, value, dotColor }: PhraseStatRowProps) => (
	<div className="flex items-center justify-between gap-2">
		<div className="flex items-center gap-1.5">
			<span
				className={`size-2 shrink-0 rounded-full ${dotColor}`}
				aria-hidden="true"
			/>
			<Typography tag="span" className="text-[11.5px] text-t-2">
				{label}
			</Typography>
		</div>
		<Typography
			tag="span"
			className="text-[11.5px] font-semibold tabular-nums text-t-1"
		>
			{value}
		</Typography>
	</div>
);
