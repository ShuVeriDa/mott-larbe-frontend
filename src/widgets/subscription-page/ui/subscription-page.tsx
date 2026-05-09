"use client";
import { ComponentProps, useState } from 'react';
import {
	useMySubscription,
	type BillingCycle,
	type Plan,
} from "@/entities/subscription";
import { CancelModal } from "@/features/cancel-subscription";
import { UpgradeModal } from "@/features/subscribe-plan";
import { CurrentPlanCard } from "./current-plan-card";
import { FeatureComparison } from "./feature-comparison";
import { ManageCard } from "./manage-card";
import { PaymentHistory } from "./payment-history";
import { PlanSelector } from "./plan-selector";
import { PromoCard } from "./promo-card";
import { SubscriptionTopbar } from "./subscription-topbar";

export const SubscriptionPage = () => {
	const { data: subscription } = useMySubscription();
	const [pendingPlan, setPendingPlan] = useState<Plan | null>(null);
	const [pendingCycle, setPendingCycle] = useState<BillingCycle>("monthly");
	const [upgradeOpen, setUpgradeOpen] = useState(false);
	const [cancelOpen, setCancelOpen] = useState(false);

	const hasActivePaid =
		!!subscription &&
		subscription.plan.type !== "FREE" &&
		subscription.status === "ACTIVE";

	const handleChoosePlan = (plan: Plan, cycle: BillingCycle) => {
		if (plan.type === "FREE") return;
		if (subscription?.planId === plan.id) return;
		setPendingPlan(plan);
		setPendingCycle(cycle);
		setUpgradeOpen(true);
	};

		const handleCancel: NonNullable<ComponentProps<typeof ManageCard>["onCancel"]> = () => setCancelOpen(true);
	const handleClose: NonNullable<ComponentProps<typeof UpgradeModal>["onClose"]> = () => setUpgradeOpen(false);
	const handleClose2: NonNullable<ComponentProps<typeof CancelModal>["onClose"]> = () => setCancelOpen(false);
return (
		<>
			<SubscriptionTopbar />

			<div className="flex flex-1 flex-col overflow-auto bg-panel max-md:overflow-visible">
				<div className="flex flex-col gap-4 px-[22px] py-4 pb-10 max-md:gap-3 max-md:p-3">
					<div className="grid items-start gap-4 max-md:gap-3 lg:grid-cols-[1fr_310px]">
						<div className="flex flex-col gap-3.5">
							<CurrentPlanCard subscription={subscription} />
							<PlanSelector
								subscription={subscription}
								onChoosePlan={handleChoosePlan}
							>
								<FeatureComparison />
							</PlanSelector>
						</div>

						<div className="flex flex-col gap-3.5">
							<PaymentHistory />
							<PromoCard />
							{hasActivePaid ? (
								<ManageCard onCancel={handleCancel} />
							) : null}
						</div>
					</div>
				</div>
			</div>

			<UpgradeModal
				plan={pendingPlan}
				cycle={pendingCycle}
				open={upgradeOpen}
				onClose={handleClose}
			/>

			<CancelModal
				open={cancelOpen}
				onClose={handleClose2}
			/>
		</>
	);
};
