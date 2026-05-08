"use client";

import {
	formatPrice,
	type Plan,
	type PlanLimits,
	type PlanType,
} from "@/entities/subscription";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { Check, Sparkles, TrendingUp, X } from "lucide-react";

export interface PlanCardProps {
	plan: Plan;
	popular?: boolean;
	current?: boolean;
	onChoose?: (plan: Plan) => void;
}

interface FeatureItem {
	enabled: boolean;
	label: string;
}

const TIER_ICON: Record<PlanType, typeof Sparkles> = {
	FREE: Sparkles,
	BASIC: Sparkles,
	PREMIUM: Sparkles,
	PRO: TrendingUp,
	LIFETIME: TrendingUp,
};

const buildFeatureItems = (
	plan: Plan,
	t: (key: string, vars?: Record<string, string | number>) => string,
): FeatureItem[] => {
	const limits: PlanLimits | null = plan.limits;
	if (plan.highlightFeatures && plan.highlightFeatures.length > 0) {
		return plan.highlightFeatures.map(label => ({
			enabled: true,
			label,
		}));
	}
	if (!limits) return [];

	const tFeat = (key: string, vars?: Record<string, string | number>): string =>
		t(`subscription.features.${key}`, vars);

	const translations = limits.translationsPerDay;
	const words = limits.wordsInDictionary;

	return [
		{
			enabled: true,
			label:
				translations === undefined || translations === null || translations < 0
					? tFeat("translationsUnlimited")
					: tFeat("translationsPerDay", { count: translations }),
		},
		{
			enabled: true,
			label:
				words === undefined || words === null || words < 0
					? tFeat("wordsUnlimited")
					: tFeat("words", { count: words }),
		},
		{ enabled: limits.analytics, label: tFeat("analytics") },
		{ enabled: limits.spaceRepetition, label: tFeat("spaceRepetition") },
	];
};

export const PlanCard = ({
	plan,
	popular,
	current,
	onChoose,
}: PlanCardProps) => {
	const { t, lang } = useI18n();
	const TierIcon = TIER_ICON[plan.type] ?? Sparkles;
	const features = buildFeatureItems(plan, t);

	const colorScheme = (() => {
		if (plan.type === "FREE")
			return {
				iconBg: "bg-surf-3",
				iconColor: "text-t-3",
				button: "btn-outline" as const,
			};
		if (plan.type === "PRO" || plan.type === "LIFETIME")
			return {
				iconBg: "bg-pur-bg",
				iconColor: "text-pur-t",
				button: "pro" as const,
			};
		return {
			iconBg: "bg-acc-bg",
			iconColor: "text-acc-t",
			button: "premium" as const,
		};
	})();

	const renderActionButton = () => {
		if (current) {
			return (
				<Button
					variant="ghost"
					size="default"
					disabled
					className="h-[30px] w-full cursor-default text-[11.5px] font-semibold"
				>
					{t("subscription.planCard.current")}
				</Button>
			);
		}
		if (plan.type === "FREE") {
			return null;
		}
		const baseClass =
			"h-[30px] w-full text-[11.5px] font-semibold border-0 text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)] hover:opacity-[0.88]";
		if (colorScheme.button === "pro") {
			return (
				<Button
					variant="action"
					size="default"
					className={cn(
						baseClass,
						"bg-pur shadow-[0_1px_4px_rgba(109,78,212,0.3)]",
					)}
					onClick={() => onChoose?.(plan)}
				>
					{t("subscription.planCard.choose")}
				</Button>
			);
		}
		return (
			<Button
				variant="action"
				size="default"
				className={cn(baseClass, "bg-acc")}
				onClick={() => onChoose?.(plan)}
			>
				{t("subscription.planCard.choose")}
			</Button>
		);
	};

	return (
		<article
			className={cn(
				"group/plan-card relative flex flex-col gap-3 overflow-hidden rounded-[10px] border-hairline border-bd-2 bg-surf-2 p-3.5 transition-[border-color,box-shadow] duration-150 max-md:min-w-[155px] max-md:flex-none max-md:snap-start max-md:p-3",
				popular && "border-acc bg-acc-bg dark:bg-acc/10",
				current && "bg-surf",
				!current && "hover:border-bd-3 hover:shadow-sm cursor-pointer",
			)}
			onClick={() => {
				if (!current) onChoose?.(plan);
			}}
		>
			{popular ? (
				<span className="absolute right-0 top-0 rounded-bl-[7px] rounded-tr-[10px] bg-acc px-2.5 py-[3px] text-[9px] font-bold uppercase tracking-[0.3px] text-white">
					{t("subscription.planCard.popular")}
				</span>
			) : null}

			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex size-7 shrink-0 items-center justify-center rounded-base",
						colorScheme.iconBg,
					)}
					aria-hidden="true"
				>
					<TierIcon
						className={cn("size-[13px]", colorScheme.iconColor)}
						strokeWidth={1.5}
					/>
				</div>
				<Typography tag="span" className="text-[12px] font-semibold text-t-1">
					{plan.name}
				</Typography>
			</div>

			<div>
				<Typography
					tag="span"
					className="block text-[18px] font-bold leading-[1.1] text-t-1 max-md:text-[16px]"
				>
					{plan.priceCents === 0
						? formatPrice(0, plan.currency, lang)
						: formatPrice(plan.priceCents, plan.currency, lang)}
					{plan.interval ? (
						<Typography tag="span" className="text-[11px] font-normal text-t-3">
							{" "}
							/{" "}
							{plan.interval === "month"
								? t("subscription.planCard.perMonth")
								: t("subscription.planCard.perYear")}
						</Typography>
					) : null}
				</Typography>
				{plan.priceCents === 0 ? (
					<Typography tag="span" className="mt-px block text-[10.5px] text-t-4">
						{t("subscription.planCard.forever")}
					</Typography>
				) : null}
			</div>

			<div className="flex flex-col gap-1.5">
				{features.map((feat, i) => (
					<div
						key={`${plan.id}-feat-${i}`}
						className={cn(
							"flex items-start gap-1.5 text-[11px] leading-[1.4] max-md:text-[10.5px]",
							feat.enabled ? "text-t-2" : "text-t-4",
						)}
					>
						{feat.enabled ? (
							<Check
								className={cn(
									"mt-0.5 size-[11px] shrink-0",
									colorScheme.iconColor,
								)}
								strokeWidth={2}
								aria-hidden="true"
							/>
						) : (
							<X
								className="mt-0.5 size-[11px] shrink-0"
								strokeWidth={2}
								aria-hidden="true"
							/>
						)}
						<span>{feat.label}</span>
					</div>
				))}
			</div>

			<div className="mt-auto">{renderActionButton()}</div>
		</article>
	);
};
