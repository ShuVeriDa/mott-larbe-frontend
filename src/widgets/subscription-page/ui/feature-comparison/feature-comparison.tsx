"use client";

import {
	UNLIMITED_SYMBOL,
	buildTiers,
	formatLimit,
	usePlans,
	type Plan,
	type PlanLimits,
} from "@/entities/subscription";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

interface ComparisonRow {
	labelKey: string;
	resolve: (limits: PlanLimits | null) => string;
}

const ROWS: ComparisonRow[] = [
	{
		labelKey: "subscription.comparison.translationsPerDay",
		resolve: (limits) => formatLimit(limits?.translationsPerDay),
	},
	{
		labelKey: "subscription.comparison.wordsInDictionary",
		resolve: (limits) => formatLimit(limits?.wordsInDictionary),
	},
	{
		labelKey: "subscription.comparison.analytics",
		resolve: (limits) => (limits?.analytics ? "✓" : "—"),
	},
	{
		labelKey: "subscription.comparison.spaceRepetition",
		resolve: (limits) => (limits?.spaceRepetition ? "✓" : "—"),
	},
	{
		labelKey: "subscription.comparison.flashcards",
		resolve: (limits) => (limits?.hasFlashcards ? "✓" : "—"),
	},
	{
		labelKey: "subscription.comparison.complexTexts",
		resolve: (limits) => (limits?.hasComplexTexts ? "✓" : "—"),
	},
	{
		labelKey: "subscription.comparison.advancedAnalytics",
		resolve: (limits) => (limits?.hasAdvancedAnalytics ? "✓" : "—"),
	},
	{
		labelKey: "subscription.comparison.prioritySupport",
		resolve: (limits) => (limits?.hasPrioritySupport ? "✓" : "—"),
	},
];

const valueClass = (value: string, type: Plan["type"]): string => {
	if (value === "—") return "text-t-4 font-normal";
	if (type === "PRO" || type === "LIFETIME") return "text-pur-t font-semibold";
	if (type === "PREMIUM" || type === "BASIC")
		return "text-acc-t font-semibold";
	if (value === UNLIMITED_SYMBOL) return "text-acc-t font-semibold";
	if (value === "✓") return "text-grn-t font-semibold";
	return "text-t-2 font-semibold";
};

export const FeatureComparison = () => {
	const { t } = useI18n();
	const { data } = usePlans();
	const tiers = data ? buildTiers(data) : [];

	if (tiers.length < 2) return null;

	const visiblePlans: Plan[] = tiers
		.map((tier) => tier.monthly ?? tier.yearly)
		.filter((p): p is Plan => p !== null);

	return (
		<div className="hidden border-hairline border-t border-bd-1 px-4 pb-3.5 pt-3.5 md:block">
			<Typography
				tag="span"
				className="block pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("subscription.comparison.title")}
			</Typography>

			<div
				className="grid items-center gap-1 border-hairline border-b border-bd-1 py-2"
				style={{
					gridTemplateColumns: `1fr repeat(${visiblePlans.length}, 64px)`,
				}}
			>
				<Typography
					tag="span"
					className="text-[10.5px] font-semibold uppercase tracking-[0.5px] text-t-3"
				>
					{t("subscription.comparison.feature")}
				</Typography>
				{visiblePlans.map((plan) => (
					<Typography
						key={plan.id}
						tag="span"
						className={cn(
							"text-center text-[10.5px] font-semibold uppercase",
							plan.type === "FREE" && "text-t-3",
							(plan.type === "PREMIUM" || plan.type === "BASIC") && "text-acc-t",
							(plan.type === "PRO" || plan.type === "LIFETIME") && "text-pur-t",
						)}
					>
						{plan.name}
					</Typography>
				))}
			</div>

			{ROWS.map((row) => (
				<div
					key={row.labelKey}
					className="grid items-center gap-1 border-hairline border-b border-bd-1 py-1.5 last:border-b-0"
					style={{
						gridTemplateColumns: `1fr repeat(${visiblePlans.length}, 64px)`,
					}}
				>
					<Typography tag="span" className="text-[11.5px] text-t-2">
						{t(row.labelKey)}
					</Typography>
					{visiblePlans.map((plan) => {
						const value = row.resolve(plan.limits);
						return (
							<Typography
								key={`${plan.id}-${row.labelKey}`}
								tag="span"
								className={cn(
									"text-center text-[11.5px]",
									valueClass(value, plan.type),
								)}
							>
								{value}
							</Typography>
						);
					})}
				</div>
			))}
		</div>
	);
};
