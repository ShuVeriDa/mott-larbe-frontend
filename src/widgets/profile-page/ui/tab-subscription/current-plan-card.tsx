"use client";

import Link from "next/link";
import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import {
	useMySubscription,
	useUsage,
	isUnlimited,
	UNLIMITED_SYMBOL,
	type Subscription,
	type UsageResponse,
} from "@/entities/subscription";
import { ProfileCard as SettingCard } from "../profile-card";

const FreeIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-4">
		<circle cx="8" cy="8" r="6" />
		<path d="M8 5v4l2.5 1.5" strokeLinecap="round" />
	</svg>
);

const PremiumIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-4">
		<path d="M2 11l2.5-5L8 9l3.5-7L14 11H2z" strokeLinejoin="round" />
	</svg>
);

interface LimitBarProps {
	label: string;
	used: number;
	max: number | undefined;
	color: string;
}

const LimitBar = ({ label, used, max, color }: LimitBarProps) => {
	const unlimited = isUnlimited(max);
	const pct = unlimited || !max ? 0 : Math.min(100, Math.round((used / max) * 100));
	const displayMax = unlimited ? UNLIMITED_SYMBOL : max;

	return (
		<div className="flex flex-col gap-1">
			<div className="flex justify-between text-[12px]">
				<span className="text-t-2">{label}</span>
				<span className="text-t-2">
					<strong className="text-t-1">{used}</strong> / {displayMax}
				</span>
			</div>
			<div className="h-[3px] rounded-[2px] bg-surf-3 overflow-hidden">
				<div
					className={`h-full rounded-[2px] ${color}`}
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
};

const getStatusLabel = (sub: Subscription, t: (k: string) => string): string => {
	switch (sub.status) {
		case "ACTIVE": return t("profile.subscription.active");
		case "TRIALING": return t("profile.subscription.trialing");
		case "CANCELED": return t("profile.subscription.canceled");
		case "EXPIRED": return t("profile.subscription.expired");
	}
};

const getStatusStyle = (sub: Subscription): string => {
	if (sub.status === "ACTIVE" || sub.status === "TRIALING")
		return "bg-grn-bg text-grn-t border-grn/20";
	return "bg-surf-2 text-t-2 border-bd-2";
};

interface CurrentPlanCardProps {
	subscription: Subscription | null | undefined;
	usage: UsageResponse | undefined;
	lang: string;
}

const CurrentPlanCard = ({ subscription, usage, lang }: CurrentPlanCardProps) => {
	const { t } = useI18n();
	const isFree = !subscription || subscription.plan.type === "FREE";

	return (
		<SettingCard title={t("profile.subscription.currentPlan")} noBody>
			<div className="flex items-center gap-3 px-4 py-3.5 border-b border-hairline border-bd-1">
				<span className={`flex size-9 shrink-0 items-center justify-center rounded-[9px] ${isFree ? "bg-surf-2 text-t-2" : "bg-acc-bg text-acc-t"}`}>
					{isFree ? <FreeIcon /> : <PremiumIcon />}
				</span>
				<div className="flex-1 min-w-0">
					<Typography tag="p" className="text-[13px] font-semibold text-t-1 mb-0.5">
						{subscription?.plan.name ?? t("profile.header.freePlan")}
					</Typography>
					<Typography tag="p" className="text-[11.5px] text-t-3 truncate">
						{subscription
							? subscription.plan.description ?? ""
							: t("profile.subscription.freeDesc")}
					</Typography>
				</div>
				{subscription ? (
					<span className={`px-2 py-0.5 rounded-[5px] text-[11px] font-semibold border-hairline ${getStatusStyle(subscription)}`}>
						{getStatusLabel(subscription, t)}
					</span>
				) : (
					<span className="px-2 py-0.5 rounded-[5px] text-[11px] font-semibold bg-surf-2 border-hairline border-bd-2 text-t-2">
						{t("profile.subscription.active")}
					</span>
				)}
			</div>

			{usage ? (
				<div className="flex flex-col gap-2.5 px-4 py-3.5 border-b border-hairline border-bd-1">
					<LimitBar
						label={t("profile.subscription.translationsToday")}
						used={usage.translationsToday}
						max={usage.limits.translationsPerDay}
						color="bg-amb"
					/>
					<LimitBar
						label={t("profile.subscription.wordsInDictionary")}
						used={usage.wordsInDictionary}
						max={usage.limits.wordsInDictionary}
						color="bg-acc"
					/>
				</div>
			) : null}

			<div className="px-4 py-3.5">
				<Link href={`/${lang}/subscription`}>
					<Button variant="action" className="w-full h-8 text-[12.5px]">
						{t("profile.subscription.upgradePlan")}
					</Button>
				</Link>
			</div>
		</SettingCard>
	);
};

export const CurrentPlanCardContainer = ({ lang }: { lang: string }) => {
	const { data: subscription } = useMySubscription();
	const { data: usage } = useUsage();

	return (
		<CurrentPlanCard
			subscription={subscription}
			usage={usage}
			lang={lang}
		/>
	);
};
