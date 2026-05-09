"use client";

import type { AdminSubscriptionDetail, SubscriptionStatus, PlanType } from "@/entities/admin-subscription";
import { SubscriptionStatusBadge } from "./subscription-status-badge";
import { SubscriptionPlanChip } from "./subscription-plan-chip";

interface Props {
	sub: AdminSubscriptionDetail;
	statusLabels: Record<SubscriptionStatus, string>;
	planLabels: Record<NonNullable<PlanType>, string>;
}

export const SubscriptionHeroSection = ({ sub, statusLabels, planLabels }: Props) => {
	const initials = (sub.user.name[0] ?? "") + (sub.user.surname[0] ?? "");

	return (
		<div className="border-b border-bd-1 px-[15px] py-4">
			<div className="mb-2.5 flex size-11 items-center justify-center rounded-full bg-surf-3 text-[14px] font-bold text-t-2">
				{initials}
			</div>
			<div className="mb-0.5 text-[14.5px] font-semibold text-t-1">
				{sub.user.name} {sub.user.surname}
			</div>
			<div className="mb-2.5 text-[11.5px] text-t-3">{sub.user.email}</div>
			<div className="flex flex-wrap gap-1">
				<SubscriptionStatusBadge status={sub.status} label={statusLabels[sub.status]} />
				{sub.plan.type && (
					<SubscriptionPlanChip plan={sub.plan.type} label={planLabels[sub.plan.type]} />
				)}
			</div>
		</div>
	);
};
