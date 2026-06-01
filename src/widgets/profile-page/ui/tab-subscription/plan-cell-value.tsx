"use client";

import { Typography } from "@/shared/ui/typography";

const CheckIcon = () => (
	<svg
		viewBox="0 0 12 12"
		fill="none"
		stroke="currentColor"
		strokeWidth="1.5"
		className="size-3 text-grn-t"
	>
		<path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);

const DashIcon = () => (
	<Typography
		tag="span"
		className="inline-block w-3 text-center text-[12px] text-t-4"
	>
		—
	</Typography>
);

export interface PlanCellValueProps {
	value: string | boolean;
	color: string;
}

export const PlanCellValue = ({ value, color }: PlanCellValueProps) => {
	if (typeof value === "boolean") {
		return value ? <CheckIcon /> : <DashIcon />;
	}
	return (
		<Typography tag="span" className={`text-[12px] font-semibold ${color}`}>
			{value}
		</Typography>
	);
};
