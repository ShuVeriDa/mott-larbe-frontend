import { cn } from "@/shared/lib/cn";
import type { RoleName } from "@/entities/admin-user";

import { Typography } from "@/shared/ui/typography";
const roleStyles: Record<RoleName, string> = {
	learner: "bg-surf-3 text-t-2",
	support: "bg-acc-bg text-acc-t",
	content: "bg-pur-bg text-pur-t",
	linguist: "bg-amb-bg text-amb-t",
	admin: "bg-red-bg text-red-t",
	superadmin: "bg-grn-bg text-grn-t",
};

interface UserRoleChipProps {
	role: RoleName;
	label: string;
}

export const UserRoleChip = ({ role, label }: UserRoleChipProps) => (
	<Typography tag="span"
		className={cn(
			"rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
			roleStyles[role],
		)}
	>
		{label}
	</Typography>
);
