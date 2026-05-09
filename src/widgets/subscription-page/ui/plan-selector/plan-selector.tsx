"use client";

import { useState, type ReactNode } from "react";
import {
	buildTiers,
	pickPlanForCycle,
	usePlans,
	type BillingCycle,
	type Plan,
	type Subscription,
} from "@/entities/subscription";
import { BillingCycleToggle } from "@/features/billing-cycle-toggle";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { SectionCard } from "../section-card";
import { PlanCard } from "./plan-card";

export interface PlanSelectorProps {
	subscription?: Subscription | null;
	onChoosePlan: (plan: Plan, cycle: BillingCycle) => void;
	children?: ReactNode;
}

const computeYearlyDiscount = (tiers: ReturnType<typeof buildTiers>): number => {
	for (const tier of tiers) {
		if (tier.monthly && tier.yearly && tier.monthly.priceCents > 0) {
			const yearlyMonth = tier.yearly.priceCents / 12;
			const diff =
				((tier.monthly.priceCents - yearlyMonth) / tier.monthly.priceCents) *
				100;
			if (diff > 0) return Math.round(diff);
		}
	}
	return 0;
};

export const PlanSelector = ({
	subscription,
	onChoosePlan,
	children,
}: PlanSelectorProps) => {
	const { t } = useI18n();
	const [cycle, setCycle] = useState<BillingCycle>("monthly");
	const { data, isLoading, isError } = usePlans();

	const tiers = data ? buildTiers(data) : [];
	const yearlyDiscount = computeYearlyDiscount(tiers);

	const currentPlanId = subscription?.planId ?? null;

	return (
		<SectionCard
			title={t("subscription.planSelector.title")}
			headerExtra={
				<BillingCycleToggle
					value={cycle}
					onChange={setCycle}
					yearlyDiscountPercent={yearlyDiscount}
				/>
			}
		>
			<div className="flex flex-col gap-3 px-4 py-4 max-md:px-3 max-md:py-3">
				{isLoading ? (
					<Typography tag="span" className="text-[12px] text-t-3">
						{t("subscription.planSelector.loading")}
					</Typography>
				) : isError ? (
					<Typography tag="span" className="text-[12px] text-red-t">
						{t("subscription.planSelector.error")}
					</Typography>
				) : tiers.length === 0 ? (
					<Typography tag="span" className="text-[12px] text-t-3">
						{t("subscription.planSelector.empty")}
					</Typography>
				) : (
					<div className="grid grid-cols-3 gap-2.5 max-md:flex max-md:snap-x max-md:snap-mandatory max-md:flex-nowrap max-md:overflow-x-auto max-md:pb-1 max-md:[scrollbar-width:none] max-md:[&::-webkit-scrollbar]:hidden">
						{tiers.map((tier) => {
							const plan = pickPlanForCycle(tier, cycle);
							if (!plan) return null;
							const isCurrent = plan.id === currentPlanId;
							const popular = tier.type === "PREMIUM" && !isCurrent;
														const handleChoose: NonNullable<React.ComponentProps<typeof PlanCard>["onChoose"]> = (chosen) => onChoosePlan(chosen, cycle);
return (
								<PlanCard
									key={tier.key}
									plan={plan}
									popular={popular}
									current={isCurrent}
									onChoose={handleChoose}
								/>
							);
						})}
					</div>
				)}
			</div>
			{children}
		</SectionCard>
	);
};
