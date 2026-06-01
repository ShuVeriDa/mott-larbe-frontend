"use client";

import { isUnlimited, UNLIMITED_SYMBOL } from "@/entities/subscription";
import { Typography } from "@/shared/ui/typography";

export interface LimitBarProps {
	label: string;
	used: number;
	max: number | undefined;
	color: string;
}

export const LimitBar = ({ label, used, max, color }: LimitBarProps) => {
	const unlimited = isUnlimited(max);
	const pct =
		unlimited || !max ? 0 : Math.min(100, Math.round((used / max) * 100));
	const displayMax = unlimited ? UNLIMITED_SYMBOL : max;

	return (
		<div className="flex flex-col gap-1">
			<div className="flex justify-between text-[12px]">
				<Typography tag="span" className="text-t-2">
					{label}
				</Typography>
				<Typography tag="span" className="text-t-2">
					<Typography tag="strong" className="text-t-1">
						{used}
					</Typography>{" "}
					/ {displayMax}
				</Typography>
			</div>
			<div className="h-[3px] rounded-[2px] bg-surf-3 overflow-hidden">
				<div
					className={`h-full rounded-[2px] ${color}`}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
};
