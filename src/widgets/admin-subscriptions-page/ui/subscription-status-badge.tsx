import { cn } from "@/shared/lib/cn";
import type { SubscriptionStatus } from "@/entities/admin-subscription";

interface Props {
	status: SubscriptionStatus;
	label: string;
}

const styles: Record<SubscriptionStatus, string> = {
	ACTIVE: "bg-grn-bg text-grn-t",
	TRIALING: "bg-acc-bg text-acc-t",
	CANCELED: "bg-amb-bg text-amb-t",
	EXPIRED: "bg-surf-3 text-t-2",
};

const dotStyles: Record<SubscriptionStatus, string> = {
	ACTIVE: "bg-grn",
	TRIALING: "bg-acc",
	CANCELED: "bg-amb",
	EXPIRED: "bg-t-3",
};

export const SubscriptionStatusBadge = ({ status, label }: Props) => (
	<span
		className={cn(
			"inline-flex items-center gap-[3px] rounded-[5px] px-[7px] py-[2px] text-[10.5px] font-semibold whitespace-nowrap",
			styles[status],
		)}
	>
		<span className={cn("size-[5px] shrink-0 rounded-full", dotStyles[status])} />
		{label}
	</span>
);
