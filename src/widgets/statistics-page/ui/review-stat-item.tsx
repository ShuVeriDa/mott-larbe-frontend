"use client";
import { Typography } from "@/shared/ui/typography";

interface ReviewStatItemProps {
	label: string;
	value: string;
	sub?: string;
}

export const ReviewStatItem = ({ label, value, sub }: ReviewStatItemProps) => (
	<div className="flex flex-col gap-0.5">
		<Typography tag="span" className="text-[10.5px] text-t-3">{label}</Typography>
		<Typography tag="span" className="text-base font-semibold text-t-1">{value}</Typography>
		{sub && <Typography tag="span" className="text-[10px] text-t-3">{sub}</Typography>}
	</div>
);
