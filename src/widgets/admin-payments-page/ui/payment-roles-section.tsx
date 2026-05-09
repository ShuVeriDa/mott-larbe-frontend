"use client";

import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type { AdminPaymentDetail } from "@/entities/admin-payment";

const ROLE_CHIP_CFG: Record<string, string> = {
	Learner: "bg-surf-3 text-t-2",
	Support: "bg-acc-bg text-acc-t",
	Content: "bg-pur-bg text-pur-t",
	Linguist: "bg-amb-bg text-amb-t",
};

interface Props {
	payment: AdminPaymentDetail;
	t: (key: string) => string;
}

export const PaymentRolesSection = ({ payment, t }: Props) => {
	if (payment.user.roles.length === 0) return null;
	return (
		<div className="border-b border-bd-1 px-[15px] py-2.5">
			<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
				{t("admin.payments.detail.roles")}
			</div>
			<div className="flex flex-wrap gap-1">
				{payment.user.roles.map(r => (
					<Typography tag="span"
						key={r.role.name}
						className={cn(
							"inline-block rounded px-1.5 py-px text-[10px] font-semibold",
							ROLE_CHIP_CFG[r.role.name] ?? "bg-surf-3 text-t-2",
						)}
					>
						{r.role.name}
					</Typography>
				))}
			</div>
		</div>
	);
};
