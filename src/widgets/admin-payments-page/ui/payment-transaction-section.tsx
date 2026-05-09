"use client";

import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type { AdminPaymentDetail, AdminPaymentListItem, PaymentProvider, PaymentBackendStatus } from "@/entities/admin-payment";
import { PaymentOtherPaymentsList } from "./payment-other-payments-list";

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

const fmtAmount = (item: AdminPaymentDetail | AdminPaymentListItem): string => {
	if (item.status === "FAILED") return "—";
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

const fmtDate = (iso: string | null, fallback = "—") => {
	if (!iso) return fallback;
	return new Date(iso).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

interface Props {
	payment: AdminPaymentDetail;
	otherPayments: AdminPaymentListItem[];
	t: (key: string) => string;
}

export const PaymentTransactionSection = ({
	payment,
	otherPayments,
	t,
}: Props) => {
	const planName = payment.subscription?.plan?.name ?? "—";
	const provColor = PROVIDER_COLORS[payment.provider] ?? "#a5a39a";
	const amtStr = fmtAmount(payment);
	const sc = STATUS_CFG[payment.status] ?? STATUS_CFG.PENDING;
	const amtColor =
		payment.status === "SUCCEEDED"
			? "text-grn-t"
			: payment.status === "REFUNDED"
				? "text-red-t"
				: "text-t-3";
	const txIconBg =
		payment.status === "REFUNDED"
			? "bg-amb-bg"
			: payment.status === "FAILED"
				? "bg-red-bg"
				: "bg-grn-bg";
	const txIconColor =
		payment.status === "REFUNDED"
			? "text-amb-t"
			: payment.status === "FAILED"
				? "text-red-t"
				: "text-grn-t";

	return (
		<div className="border-b border-bd-1 px-[15px] py-2.5">
			<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
				{t("admin.payments.detail.transaction")}
			</div>

			<div className="mb-2.5 rounded-lg border border-bd-1 bg-surf-2 p-3">
				<div className="mb-2 flex items-center gap-2">
					<div
						className={cn(
							"flex size-[30px] shrink-0 items-center justify-center rounded-lg",
							txIconBg,
						)}
					>
						<svg
							className={cn("size-[14px]", txIconColor)}
							viewBox="0 0 14 14"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.4"
						>
							{payment.status === "REFUNDED" ? (
								<path
									d="M2 8l3-3 2 2 3-3 2 2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							) : payment.status === "FAILED" ? (
								<>
									<circle cx="7" cy="7" r="5.5" />
									<path d="M5 5l4 4M9 5l-4 4" strokeLinecap="round" />
								</>
							) : (
								<path
									d="M2.5 7l3 3 6-6"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							)}
						</svg>
					</div>
					<div className="flex-1 text-[13px] font-semibold text-t-1">
						{planName}
					</div>
					<div className={cn("text-[14px] font-bold", amtColor)}>
						{payment.status === "REFUNDED" ? "−" : ""}
						{amtStr}
					</div>
				</div>

				<div className="space-y-[3px]">
					<div className="flex items-center justify-between text-[11.5px]">
						<Typography tag="span" className="text-t-3">ID</Typography>
						<Typography tag="span" className="font-mono text-[11px] text-t-2">
							{payment.providerPaymentId}
						</Typography>
					</div>
					<div className="flex items-center justify-between text-[11.5px]">
						<Typography tag="span" className="text-t-3">
							{t("admin.payments.detail.provider")}
						</Typography>
						<Typography tag="span" className="inline-flex items-center gap-1 rounded border border-bd-2 bg-surf px-1.5 py-px text-[10.5px] font-medium text-t-2">
							<Typography tag="span"
								className="size-1.5 rounded-full"
								style={{ background: provColor }}
							/>
							{payment.provider}
						</Typography>
					</div>
					<div className="flex items-center justify-between text-[11.5px]">
						<Typography tag="span" className="text-t-3">
							{t("admin.payments.detail.date")}
						</Typography>
						<Typography tag="span" className="font-medium text-t-2">
							{fmtDate(payment.createdAt)}
						</Typography>
					</div>
					<div className="flex items-center justify-between text-[11.5px]">
						<Typography tag="span" className="text-t-3">
							{t("admin.payments.table.status")}
						</Typography>
						<Typography tag="span"
							className={cn(
								"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px text-[10px] font-semibold",
								sc.cls,
							)}
						>
							<Typography tag="span" className={cn("size-[5px] rounded-full", sc.dotCls)} />
							{t(sc.i18nKey)}
						</Typography>
					</div>
				</div>
			</div>

			<PaymentOtherPaymentsList payments={otherPayments} t={t} />
		</div>
	);
};
