"use client";

import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type { AdminPaymentDetail, PaymentProvider } from "@/entities/admin-payment";

const PROVIDER_COLORS: Record<PaymentProvider, string> = {
	STRIPE: "#635bff",
	PAYPAL: "#0070ba",
	PADDLE: "#07a3b1",
	LEMONSQUEEZY: "#f6b60d",
	MANUAL: "#a5a39a",
};

const PLAN_CHIP_CFG: Record<string, string> = {
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

const SUB_STATUS_CFG: Record<string, { cls: string; i18nKey: string }> = {
	ACTIVE: {
		cls: "bg-grn-bg text-grn-t",
		i18nKey: "admin.payments.subStatus.active",
	},
	TRIALING: {
		cls: "bg-acc-bg text-acc-t",
		i18nKey: "admin.payments.subStatus.trialing",
	},
	CANCELED: {
		cls: "bg-amb-bg text-amb-t",
		i18nKey: "admin.payments.subStatus.canceled",
	},
	EXPIRED: {
		cls: "bg-surf-3 text-t-2",
		i18nKey: "admin.payments.subStatus.expired",
	},
};

const initials = (name: string, surname: string) =>
	`${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase();

interface Props {
	payment: AdminPaymentDetail;
	t: (key: string) => string;
}

export const PaymentUserHeroSection = ({ payment, t }: Props) => {
	const userSub = payment.user.subscriptions[0];
	const subStatusCfg = userSub
		? (SUB_STATUS_CFG[userSub.status] ?? SUB_STATUS_CFG.EXPIRED)
		: null;
	const userSubPlanCode = userSub?.plan.type ?? "";
	const userSubPlanChipCls =
		PLAN_CHIP_CFG[userSubPlanCode] ?? "bg-surf-3 text-t-2";
	const userInitials = initials(payment.user.name, payment.user.surname);

	return (
		<div className="border-b border-bd-1 px-[15px] py-4">
			<div className="mb-2 flex size-[42px] items-center justify-center rounded-full bg-surf-3 text-[13px] font-bold text-t-2">
				{userInitials}
			</div>
			<div className="mb-0.5 text-[14px] font-semibold text-t-1">
				{payment.user.name} {payment.user.surname}
			</div>
			<div className="mb-2 text-[11.5px] text-t-3">{payment.user.email}</div>
			<div className="flex flex-wrap gap-1">
				{subStatusCfg && (
					<Typography tag="span"
						className={cn(
							"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px text-[10.5px] font-semibold",
							subStatusCfg.cls,
						)}
					>
						<Typography tag="span" className="size-[5px] rounded-full bg-current" />
						{t(subStatusCfg.i18nKey)}
					</Typography>
				)}
				{userSubPlanCode && (
					<Typography tag="span"
						className={cn(
							"inline-block rounded px-1.5 py-px text-[10px] font-semibold",
							userSubPlanChipCls,
						)}
					>
						{userSub?.plan.code}
					</Typography>
				)}
			</div>
		</div>
	);
};
