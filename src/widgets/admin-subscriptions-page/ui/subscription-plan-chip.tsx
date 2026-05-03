import { cn } from "@/shared/lib/cn";
import type { PlanType } from "@/entities/admin-subscription";

interface Props {
	plan: PlanType;
	label: string;
}

const styles: Record<NonNullable<PlanType>, string> = {
	FREE: "bg-surf-3 text-t-3",
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

export const SubscriptionPlanChip = ({ plan, label }: Props) => {
	if (!plan) return <span className="text-[12px] text-t-3">—</span>;
	return (
		<span
			className={cn(
				"inline-flex items-center rounded px-[7px] py-[2px] text-[10px] font-semibold whitespace-nowrap",
				styles[plan] ?? "bg-surf-3 text-t-3",
			)}
		>
			{label}
		</span>
	);
};
