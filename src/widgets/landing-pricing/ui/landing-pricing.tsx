"use client";

import {
	PricingToggle,
	useBillingPeriod,
} from "@/features/landing-pricing-toggle";
import { useI18n } from "@/shared/lib/i18n";
import { PlanCard, type PlanKey } from "./plan-card";

interface PricingPlanDef {
	key: PlanKey;
	popular?: boolean;
}

const PLANS: PricingPlanDef[] = [
	{ key: "free" },
	{ key: "premium", popular: true },
	{ key: "pro" },
];

interface LandingPricingProps {
	startHref: string;
}

export const LandingPricing = ({ startHref }: LandingPricingProps) => {
	const { t, dict } = useI18n();
	const { period, setPeriod } = useBillingPeriod("monthly");

	const getFeatures = (key: PlanKey): string[] => {
		const plans = (
			dict as unknown as {
				landing?: {
					pricing?: {
						plans?: Record<
							PlanKey,
							{ features?: string[]; disabled?: string[] }
						>;
					};
				};
			}
		).landing?.pricing?.plans;
		return plans?.[key]?.features ?? [];
	};

	const getDisabled = (key: PlanKey): string[] => {
		const plans = (
			dict as unknown as {
				landing?: {
					pricing?: {
						plans?: Record<
							PlanKey,
							{ features?: string[]; disabled?: string[] }
						>;
					};
				};
			}
		).landing?.pricing?.plans;
		return plans?.[key]?.disabled ?? [];
	};

	return (
		<section
			id="pricing"
			className="border-hairline border-y border-bd-1 bg-surf-2 px-7 py-[88px] max-[900px]:px-[22px] max-[900px]:py-16 max-[640px]:px-[18px] max-[640px]:py-14"
			aria-labelledby="pricing-title"
		>
			<div className="mx-auto w-full max-w-[1120px]">
				<header className="mb-12 text-center max-[640px]:mb-9">
					<span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-acc-bg px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[1.2px] text-acc-t">
						{t("landing.pricing.eyebrow")}
					</span>
					<h2
						id="pricing-title"
						className="mx-auto max-w-[720px] font-display text-[38px] font-semibold leading-[1.15] tracking-[-0.7px] text-t-1 max-[900px]:text-[32px] max-[640px]:text-[26px] max-[640px]:tracking-[-0.5px]"
					>
						{t("landing.pricing.title")}
					</h2>
					<p className="mx-auto mt-3.5 max-w-[620px] text-base leading-[1.55] text-t-2 max-[640px]:text-[14.5px]">
						{t("landing.pricing.sub")}
					</p>
					<PricingToggle value={period} onChange={setPeriod} />
				</header>

				<div className="mt-10 grid grid-cols-3 items-stretch gap-4 max-[900px]:mx-auto max-[900px]:max-w-[460px] max-[900px]:grid-cols-1">
					{PLANS.map((plan) => {
						const monthlyPrice = t(
							`landing.pricing.plans.${plan.key}.priceM`,
						);
						const yearlyPrice = t(
							`landing.pricing.plans.${plan.key}.priceY`,
						);
						const isYearly = period === "yearly";
						const price = isYearly ? yearlyPrice : monthlyPrice;
						const priceOld =
							isYearly && plan.key !== "free" ? monthlyPrice : undefined;

						return (
							<PlanCard
								key={plan.key}
								planKey={plan.key}
								name={t(`landing.pricing.plans.${plan.key}.name`)}
								tagline={t(`landing.pricing.plans.${plan.key}.tagline`)}
								price={price}
								priceOld={priceOld}
								periodSuffix={t("landing.pricing.perMonth")}
								foreverLabel={t("landing.pricing.forever")}
								popularBadge={
									plan.popular ? t("landing.pricing.popular") : undefined
								}
								features={getFeatures(plan.key)}
								disabledFeatures={getDisabled(plan.key)}
								ctaLabel={t(`landing.pricing.plans.${plan.key}.cta`)}
								ctaHref={startHref}
							/>
						);
					})}
				</div>
			</div>
		</section>
	);
};
