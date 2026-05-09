"use client";

import { Typography } from "@/shared/ui/typography";

import { useI18n } from "@/shared/lib/i18n";
import type { AdminPlan } from "@/entities/admin-billing";
import { BillingPlanCard, BillingPlanCardSkeleton } from "./billing-plan-card";

interface BillingPlansGridProps {
	plans: AdminPlan[];
	isLoading: boolean;
	onEdit: (plan: AdminPlan) => void;
	onEditLimits: (plan: AdminPlan) => void;
	onDeactivate: (id: string) => void;
}

export const BillingPlansGrid = ({
	plans,
	isLoading,
	onEdit,
	onEditLimits,
	onDeactivate,
}: BillingPlansGridProps) => {
	const { t } = useI18n();
	const maxSubscribers = Math.max(...plans.map((p) => p.subscriberCount), 1);

	return (
		<section className="mb-5">
			<div className="mb-3 flex items-center justify-between">
				<Typography tag="span" className="text-[13px] font-semibold text-t-1">
					{t("admin.plans.plansSection.title")}
				</Typography>
			</div>
			<div className="overflow-x-auto">
				<div className="grid min-w-[520px] grid-cols-5 gap-2.5 max-lg:grid-cols-3 max-sm:grid-cols-2">
					{isLoading
						? Array.from({ length: 5 }).map((_, i) => (
								<BillingPlanCardSkeleton key={i} />
							))
						: plans.map((plan) => (
								<BillingPlanCard
									key={plan.id}
									plan={plan}
									maxSubscribers={maxSubscribers}
									onEdit={onEdit}
									onEditLimits={onEditLimits}
									onDeactivate={onDeactivate}
								/>
							))}
				</div>
			</div>
		</section>
	);
};
