import { cn } from "@/shared/lib/cn";
import type { UserStatus } from "@/entities/admin-user";

import { Typography } from "@/shared/ui/typography";
const statusConfig: Record<
	UserStatus,
	{ label: string; dot: string; wrap: string }
> = {
	ACTIVE: {
		label: "",
		dot: "bg-grn",
		wrap: "bg-grn-bg text-grn-t",
	},
	BLOCKED: {
		label: "",
		dot: "bg-red",
		wrap: "bg-red-bg text-red-t",
	},
	FROZEN: {
		label: "",
		dot: "bg-amb",
		wrap: "bg-amb-bg text-amb-t",
	},
	DELETED: {
		label: "",
		dot: "bg-t-3",
		wrap: "bg-surf-3 text-t-2",
	},
};

interface UserStatusBadgeProps {
	status: UserStatus;
	labels: Record<string, string>;
}

export const UserStatusBadge = ({ status, labels }: UserStatusBadgeProps) => {
	const cfg = statusConfig[status];
	return (
		<Typography tag="span"
			className={cn(
				"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[10.5px] font-semibold whitespace-nowrap",
				cfg.wrap,
			)}
		>
			<Typography tag="span" className={cn("size-[5px] shrink-0 rounded-full", cfg.dot)} />
			{labels[status.toLowerCase()] ?? status}
		</Typography>
	);
};
