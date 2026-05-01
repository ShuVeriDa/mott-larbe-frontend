"use client";

import { Clock, Sparkles } from "lucide-react";
import {
	UNLIMITED_SYMBOL,
	useMySubscription,
	useUsage,
	type Subscription,
	type SubscriptionStatus,
} from "@/entities/subscription";
import { useI18n } from "@/shared/lib/i18n";
import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";
import { SectionCard } from "../section-card";
import { LimitBar } from "./limit-bar";

const statusVariant = (
	status: SubscriptionStatus | undefined,
): "grn" | "amb" | "red" | "neu" => {
	switch (status) {
		case "ACTIVE":
			return "grn";
		case "TRIALING":
			return "amb";
		case "CANCELED":
		case "EXPIRED":
			return "red";
		default:
			return "neu";
	}
};

const FreePlanIcon = () => (
	<Clock
		className="size-5 text-acc-t"
		strokeWidth={1.5}
		aria-hidden="true"
	/>
);

const PaidPlanIcon = () => (
	<Sparkles
		className="size-5 text-acc-t"
		strokeWidth={1.5}
		aria-hidden="true"
	/>
);

export interface CurrentPlanCardProps {
	subscription?: Subscription | null;
}

export const CurrentPlanCard = ({ subscription }: CurrentPlanCardProps) => {
	const { t } = useI18n();
	const { data: subFromQuery } = useMySubscription();
	const { data: usage, isLoading: usageLoading } = useUsage();

	const sub = subscription !== undefined ? subscription : subFromQuery;
	const isFree = !sub;
	const planName = sub?.plan?.name ?? t("subscription.currentPlan.freeName");
	const planDescription =
		sub?.plan?.description ?? t("subscription.currentPlan.freeDescription");

	const statusLabel = isFree
		? t("subscription.currentPlan.statusFree")
		: t(`subscription.currentPlan.status.${sub.status}`);

	const translationsLimit = usage?.limits.translationsPerDay ?? 50;
	const wordsLimit = usage?.limits.wordsInDictionary ?? 500;

	return (
		<SectionCard
			title={t("subscription.currentPlan.title")}
			headerExtra={
				<Badge variant={isFree ? "neu" : statusVariant(sub?.status)}>
					{statusLabel}
				</Badge>
			}
		>
			<div className="flex items-start gap-3.5 border-hairline border-b border-bd-1 px-4 py-4 max-md:px-3 max-md:py-3">
				<div
					className="flex size-11 shrink-0 items-center justify-center rounded-[11px] border-hairline border-acc/15 bg-acc-bg max-md:size-[38px] max-md:rounded-[9px]"
					aria-hidden="true"
				>
					{isFree ? <FreePlanIcon /> : <PaidPlanIcon />}
				</div>
				<div className="min-w-0 flex-1">
					<Typography
						tag="span"
						className="mb-1 block text-[15px] font-semibold text-t-1 max-md:text-[14px]"
					>
						{planName}
					</Typography>
					<Typography
						tag="span"
						className="block text-[12px] leading-[1.5] text-t-3"
					>
						{planDescription}
					</Typography>
				</div>
			</div>

			<div className="flex flex-col gap-3 px-4 py-4 max-md:px-3 max-md:py-3">
				<Typography
					tag="span"
					className="pb-1 text-[10.5px] font-semibold uppercase tracking-[0.6px] text-t-3"
				>
					{t("subscription.currentPlan.usageToday")}
				</Typography>

				{usageLoading ? (
					<Typography tag="span" className="text-[12px] text-t-3">
						{t("subscription.currentPlan.loading")}
					</Typography>
				) : (
					<>
						<LimitBar
							label={t("subscription.currentPlan.translations")}
							used={usage?.translationsToday ?? 0}
							limit={translationsLimit}
							tone="amber"
							unlimitedLabel={UNLIMITED_SYMBOL}
						/>
						<LimitBar
							label={t("subscription.currentPlan.words")}
							used={usage?.wordsInDictionary ?? 0}
							limit={wordsLimit}
							tone="blue"
							unlimitedLabel={UNLIMITED_SYMBOL}
						/>
					</>
				)}
			</div>
		</SectionCard>
	);
};
