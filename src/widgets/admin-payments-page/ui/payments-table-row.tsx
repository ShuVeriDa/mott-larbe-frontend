"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { ComponentProps } from "react";
import { cn } from "@/shared/lib/cn";
import type {
	AdminPaymentListItem,
	PaymentBackendStatus,
	PaymentProvider,
} from "@/entities/admin-payment";

const PROVIDER_COLORS: Record<PaymentProvider, string> = {
	STRIPE: "#635bff",
	PAYPAL: "#0070ba",
	PADDLE: "#07a3b1",
	LEMONSQUEEZY: "#f6b60d",
	MANUAL: "#a5a39a",
};

const STATUS_CFG: Record<
	PaymentBackendStatus,
	{ cls: string; dotCls: string; i18nKey: string }
> = {
	SUCCEEDED: {
		cls: "bg-grn-bg text-grn-t",
		dotCls: "bg-grn",
		i18nKey: "admin.payments.status.paid",
	},
	REFUNDED: {
		cls: "bg-amb-bg text-amb-t",
		dotCls: "bg-amb",
		i18nKey: "admin.payments.status.refunded",
	},
	FAILED: {
		cls: "bg-red-bg text-red-t",
		dotCls: "bg-red",
		i18nKey: "admin.payments.status.failed",
	},
	PENDING: {
		cls: "bg-acc-bg text-acc-t",
		dotCls: "bg-acc",
		i18nKey: "admin.payments.status.pending",
	},
};

const PLAN_CHIP_CFG: Record<string, string> = {
	BASIC: "bg-acc-bg text-acc-t",
	PRO: "bg-grn-bg text-grn-t",
	PREMIUM: "bg-pur-bg text-pur-t",
	LIFETIME: "bg-amb-bg text-amb-t",
};

const getPeriod = (item: AdminPaymentListItem, trialKey: string): string => {
	const plan = item.subscription?.plan;
	if (!plan) return "—";
	if (plan.type === "LIFETIME") return "∞";
	const isTrial =
		item.user.subscriptions[0]?.status === "TRIALING" &&
		item.user.subscriptions[0]?.plan.type === plan.type;
	if (isTrial) return trialKey;
	if (plan.interval === "YEAR") return "1 yr";
	if (plan.interval === "MONTH") return "1 mo";
	return plan.interval ?? "—";
};

const fmtAmount = (item: AdminPaymentListItem): string => {
	if (item.status === "FAILED") return "—";
	if (item.amountCents === 0) return "0";
	try {
		return new Intl.NumberFormat("ru-RU", {
			style: "currency",
			currency: item.currency || "RUB",
			maximumFractionDigits: 0,
		}).format(item.amountCents / 100);
	} catch {
		return `${Math.round(item.amountCents / 100).toLocaleString("ru-RU")} ₽`;
	}
};

const fmtDate = (iso: string): string =>
	new Date(iso).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

const initials = (name: string, surname: string) =>
	`${name[0] ?? ""}${surname[0] ?? ""}`.toUpperCase();

interface Props {
	item: AdminPaymentListItem;
	isSelected: boolean;
	trialLabel: string;
	receiptLabel: string;
	refundLabel: string;
	onSelect: (id: string) => void;
	onReceipt: (id: string) => void;
	onRefund: (id: string) => void;
	t: (key: string) => string;
}

export const PaymentsTableRow = ({
	item,
	isSelected,
	trialLabel,
	receiptLabel,
	refundLabel,
	onSelect,
	onReceipt,
	onRefund,
	t,
}: Props) => {
	const sc = STATUS_CFG[item.status] ?? STATUS_CFG.PENDING;
	const planCode = item.subscription?.plan?.type ?? "";
	const planName = item.subscription?.plan?.name ?? "—";
	const planCls = PLAN_CHIP_CFG[planCode] ?? "bg-surf-3 text-t-2";
	const provColor = PROVIDER_COLORS[item.provider] ?? "#a5a39a";
	const period = getPeriod(item, trialLabel);
	const amtStr = fmtAmount(item);
	const init = initials(item.user.name, item.user.surname);

	const handleClick: NonNullable<ComponentProps<"tr">["onClick"]> = () => onSelect(item.id);
	const handleReceiptClick: NonNullable<ComponentProps<"button">["onClick"]> = (e) => {
		e.stopPropagation();
		onReceipt(item.id);
	};
	const handleRefundClick: NonNullable<ComponentProps<"button">["onClick"]> = (e) => {
		e.stopPropagation();
		onRefund(item.id);
	};

	return (
		<tr
			onClick={handleClick}
			className={cn(
				"group cursor-pointer border-b border-bd-1 transition-colors last:border-b-0",
				isSelected ? "bg-acc-bg" : "hover:bg-surf-2",
			)}
		>
			<td className="px-3 py-2.5 max-md:hidden">
				<Typography tag="span" className="font-mono text-[11px] text-t-3">
					{item.providerPaymentId}
				</Typography>
			</td>

			<td className="px-3 py-2.5">
				<div className="flex items-center gap-2">
					<div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-surf-3 text-[9.5px] font-bold text-t-2">
						{init}
					</div>
					<div>
						<div className="text-[12.5px] font-medium text-t-1">
							{item.user.name} {item.user.surname}
						</div>
						<div className="text-[11px] text-t-3">{item.user.email}</div>
					</div>
				</div>
			</td>

			<td className="px-3 py-2.5">
				<Typography tag="span"
					className={cn(
						"inline-block rounded px-1.5 py-px text-[10px] font-semibold whitespace-nowrap",
						planCls,
					)}
				>
					{planName} · {period}
				</Typography>
			</td>

			<td className="px-3 py-2.5 max-md:hidden">
				<Typography tag="span" className="inline-flex items-center gap-1 rounded border border-bd-2 bg-surf-2 px-1.5 py-px text-[11px] font-medium text-t-2">
					<Typography tag="span"
						className="size-1.5 rounded-full"
						style={{ background: provColor }}
					/>
					{item.provider}
				</Typography>
			</td>

			<td className="px-3 py-2.5 text-[11px] text-t-3 max-sm:hidden">
				{fmtDate(item.createdAt)}
			</td>

			<td className="px-3 py-2.5">
				<Typography tag="span"
					className={cn(
						"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px text-[10.5px] font-semibold",
						sc.cls,
					)}
				>
					<Typography tag="span" className={cn("size-[5px] rounded-full", sc.dotCls)} />
					{t(sc.i18nKey)}
				</Typography>
			</td>

			<td className="px-3 py-2.5 text-right">
				<Typography tag="span"
					className={cn(
						"font-semibold",
						item.status === "SUCCEEDED"
							? "text-grn-t"
							: item.status === "REFUNDED"
								? "text-red-t"
								: "text-t-3",
					)}
				>
					{item.status === "REFUNDED" ? "−" : ""}
					{amtStr}
				</Typography>
			</td>

			<td className="px-3 py-2.5">
				<div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 [tr.bg-acc-bg_&]:opacity-100">
					<Button
						onClick={handleReceiptClick}
						className="flex h-[24px] items-center rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						{receiptLabel}
					</Button>
					{item.status === "SUCCEEDED" && (
						<Button
							onClick={handleRefundClick}
							className="flex h-[24px] items-center rounded-[5px] border border-bd-2 bg-surf px-2 text-[11px] text-red-t transition-colors hover:border-transparent hover:bg-red-bg"
						>
							{refundLabel}
						</Button>
					)}
				</div>
			</td>
		</tr>
	);
};
