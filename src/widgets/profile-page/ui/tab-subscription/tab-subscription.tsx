import { CurrentPlanCardContainer } from "./current-plan-card";
import { PaymentHistoryCard } from "./payment-history-card";
import { PlanComparisonCard } from "./plan-comparison-card";
import { PromoCard } from "./promo-card";

export interface TabSubscriptionProps {
	lang: string;
}

export const TabSubscription = ({ lang }: TabSubscriptionProps) => (
	<div className="grid grid-cols-[1fr_300px] gap-3.5 items-start max-lg:grid-cols-1">
		<div className="flex flex-col gap-3.5">
			<CurrentPlanCardContainer lang={lang} />
			<PlanComparisonCard />
		</div>
		<div className="flex flex-col gap-3.5">
			<PaymentHistoryCard />
			<PromoCard />
		</div>
	</div>
);
