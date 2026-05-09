"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import type { AdminSubscriptionDetail, PlanType } from "@/entities/admin-subscription";

const formatDate = (date: string | null, fallback = "—") => {
	if (!date) return fallback;
	return new Date(date).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const formatAmount = (cents: number, currency: string) =>
	`${(cents / 100).toLocaleString("ru-RU")} ${currency}`;

const PLAN_ICON_STYLES: Record<NonNullable<PlanType>, { bg: string; text: string }> = {
	FREE: { bg: "bg-surf-3", text: "text-t-3" },
	BASIC: { bg: "bg-acc-bg", text: "text-acc-t" },
	PRO: { bg: "bg-grn-bg", text: "text-grn-t" },
	PREMIUM: { bg: "bg-pur-bg", text: "text-pur-t" },
	LIFETIME: { bg: "bg-amb-bg", text: "text-amb-t" },
};

const SectionTitle = ({ label }: { label: string }) => (
	<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
		{label}
	</div>
);

interface Props {
	sub: AdminSubscriptionDetail;
	labels: {
		sectionTitle: string;
		lifetime: string;
		oneTime: string;
		nextBilling: string;
		amount: string;
		startDate: string;
		endDate: string;
		canceledAt: string;
		extendAction: string;
		couponAction: string;
		cancelAction: string;
		couponPrompt: string;
	};
	isApplyCouponPending: boolean;
	onExtend: (id: string) => void;
	onCancel: (id: string) => void;
	onApplyCoupon: (code: string) => void;
}

export const SubscriptionPlanSection = ({ sub, labels, isApplyCouponPending, onExtend, onCancel, onApplyCoupon }: Props) => {
	const planStyle = sub.plan.type ? PLAN_ICON_STYLES[sub.plan.type] : { bg: "bg-surf-3", text: "text-t-3" };
	const canExtend = !sub.isLifetime && (sub.status === "ACTIVE" || sub.status === "TRIALING" || sub.status === "EXPIRED");
	const canCancel = sub.status === "ACTIVE" || sub.status === "TRIALING";

	const handleExtend: NonNullable<ComponentProps<"button">["onClick"]> = () => onExtend(sub.id);
	const handleCoupon: NonNullable<ComponentProps<"button">["onClick"]> = () => {
		const code = window.prompt(labels.couponPrompt);
		if (code?.trim()) onApplyCoupon(code.trim());
	};
	const handleCancel: NonNullable<ComponentProps<"button">["onClick"]> = () => onCancel(sub.id);

	return (
		<div className="border-b border-bd-1 px-[15px] py-2.5">
			<SectionTitle label={labels.sectionTitle} />
			<div className="mb-2.5 flex items-start gap-2.5">
				<div className={`flex size-[30px] shrink-0 items-center justify-center rounded-lg ${planStyle.bg}`}>
					<svg className={`size-[14px] ${planStyle.text}`} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
						<rect x="1" y="2.5" width="12" height="9" rx="1.5" />
						<path d="M1 5.5h12" strokeLinecap="round" />
						<path d="M3.5 8.5h4" strokeLinecap="round" />
					</svg>
				</div>
				<div>
					<div className="text-[13px] font-semibold text-t-1">{sub.plan.name}</div>
					<div className="text-[11px] leading-relaxed text-t-3">
						{sub.isLifetime ? labels.lifetime : sub.plan.interval ?? labels.oneTime}
					</div>
				</div>
			</div>
			<div className="space-y-1.5">
				<div className="flex items-baseline justify-between gap-2">
					<Typography tag="span" className="text-[11.5px] text-t-3">{labels.nextBilling}</Typography>
					<Typography tag="span" className="text-[12px] font-medium text-t-1">
						{sub.isLifetime ? "∞" : formatDate(sub.endDate)}
					</Typography>
				</div>
				<div className="flex items-baseline justify-between gap-2">
					<Typography tag="span" className="text-[11.5px] text-t-3">{labels.amount}</Typography>
					<Typography tag="span" className="text-[12px] font-medium text-t-1">
						{formatAmount(sub.plan.priceCents, sub.plan.currency)}
					</Typography>
				</div>
				<div className="flex items-baseline justify-between gap-2">
					<Typography tag="span" className="text-[11.5px] text-t-3">{labels.startDate}</Typography>
					<Typography tag="span" className="text-[12px] font-medium text-t-1">{formatDate(sub.startDate)}</Typography>
				</div>
				<div className="flex items-baseline justify-between gap-2">
					<Typography tag="span" className="text-[11.5px] text-t-3">{labels.endDate}</Typography>
					<Typography tag="span" className="text-[12px] font-medium text-t-1">
						{sub.isLifetime ? "∞" : formatDate(sub.endDate)}
					</Typography>
				</div>
				{sub.canceledAt && (
					<div className="flex items-baseline justify-between gap-2">
						<Typography tag="span" className="text-[11.5px] text-t-3">{labels.canceledAt}</Typography>
						<Typography tag="span" className="text-[12px] font-medium text-red-t">{formatDate(sub.canceledAt)}</Typography>
					</div>
				)}
			</div>
			<div className="mt-2.5 flex flex-wrap gap-1.5">
				{canExtend && (
					<Button
						onClick={handleExtend}
						className="flex h-[28px] items-center gap-1 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						{labels.extendAction}
					</Button>
				)}
				<Button
					onClick={handleCoupon}
					disabled={isApplyCouponPending}
					className="flex h-[28px] items-center gap-1 rounded-base border border-bd-2 bg-transparent px-2.5 text-[11.5px] text-t-2 transition-colors hover:bg-surf-2 hover:text-t-1 disabled:opacity-60"
				>
					{labels.couponAction}
				</Button>
				{canCancel && (
					<Button
						onClick={handleCancel}
						className="flex h-[28px] items-center gap-1 rounded-base border border-[rgba(220,38,38,0.2)] bg-transparent px-2.5 text-[11.5px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
					>
						{labels.cancelAction}
					</Button>
				)}
			</div>
		</div>
	);
};
