"use client";

import { Check } from "lucide-react";
import { Typography } from "@/shared/ui/typography";

const CheckIcon = () => <Check className="size-3 text-grn-t" />;

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
