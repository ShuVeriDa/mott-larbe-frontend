import { cn } from "@/shared/lib/cn";
import type { PlanType } from "@/entities/admin-user";

import { Typography } from "@/shared/ui/typography";
const planStyles: Record<string, string> = {
	FREE: "bg-surf-3 text-t-3",
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-pur-bg text-pur-t",
	PREMIUM: "bg-amb-bg text-amb-t",
	LIFETIME: "bg-grn-bg text-grn-t",
};

interface UserPlanChipProps {
	plan: PlanType;
	labels: Record<string, string>;
}

export const UserPlanChip = ({ plan, labels }: UserPlanChipProps) => {
	const key = plan ?? "FREE";
	return (
		<Typography tag="span"
			className={cn(
				"rounded px-1.5 py-0.5 text-[10px] font-semibold",
				planStyles[key] ?? planStyles.FREE,
			)}
		>
			{labels[key.toLowerCase()] ?? key}
		</Typography>
	);
};
