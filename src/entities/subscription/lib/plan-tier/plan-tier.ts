import type {
	BillingCycle,
	BillingInterval,
	Plan,
	PlanType,
	PlansResponse,
} from "../../api";

export type TierKey = "free" | "premium" | "pro" | string;

export interface PlanTier {
	key: TierKey;
	type: PlanType;
	groupCode: string | null;
	monthly: Plan | null;
	yearly: Plan | null;
}

const PRIORITY: Record<PlanType, number> = {
	FREE: 0,
	BASIC: 1,
	PREMIUM: 2,
	PRO: 3,
	LIFETIME: 4,
};

const intervalToCycle = (interval: BillingInterval | null): BillingCycle | null => {
	if (interval === "month") return "monthly";
	if (interval === "year") return "yearly";
	return null;
};

const tierKeyForType = (type: PlanType, groupCode: string | null): TierKey => {
	if (type === "FREE") return "free";
	if (groupCode) return groupCode.toLowerCase();
	return type.toLowerCase();
};

export const buildTiers = (response: PlansResponse): PlanTier[] => {
	const tiers: PlanTier[] = [];

	for (const plan of response.ungrouped) {
		tiers.push({
			key: tierKeyForType(plan.type, plan.groupCode),
			type: plan.type,
			groupCode: plan.groupCode,
			monthly: plan.interval === "month" ? plan : plan.interval === null ? plan : null,
			yearly: plan.interval === "year" ? plan : null,
		});
	}

	for (const group of response.groups) {
		const monthly =
			group.variants.find((v) => v.interval === "month") ?? null;
		const yearly = group.variants.find((v) => v.interval === "year") ?? null;
		const sample = group.variants[0];
		if (!sample) continue;
		tiers.push({
			key: tierKeyForType(sample.type, group.groupCode),
			type: sample.type,
			groupCode: group.groupCode,
			monthly,
			yearly,
		});
	}

	tiers.sort((a, b) => PRIORITY[a.type] - PRIORITY[b.type]);
	return tiers;
};

export const pickPlanForCycle = (
	tier: PlanTier,
	cycle: BillingCycle,
): Plan | null => {
	if (cycle === "yearly") return tier.yearly ?? tier.monthly;
	return tier.monthly ?? tier.yearly;
};

export { intervalToCycle };
