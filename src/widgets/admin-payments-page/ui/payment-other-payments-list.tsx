"use client";

import { Typography } from "@/shared/ui/typography";
import { cn } from "@/shared/lib/cn";
import type { AdminPaymentListItem, PaymentBackendStatus } from "@/entities/admin-payment";

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

const fmtAmount = (item: AdminPaymentListItem): string => {
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

interface Props {
	payments: AdminPaymentListItem[];
	t: (key: string) => string;
}

export const PaymentOtherPaymentsList = ({ payments, t }: Props) => {
	if (payments.length === 0) return null;
	return (
		<div>
			<div className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.5px] text-t-3">
				{t("admin.payments.detail.otherPayments")}
			</div>
			<div className="space-y-0">
				{payments.map(p => {
					const pSc = STATUS_CFG[p.status] ?? STATUS_CFG.PENDING;
					const pAmtColor =
						p.status === "SUCCEEDED"
							? "text-grn-t"
							: p.status === "REFUNDED"
								? "text-red-t"
								: "text-t-3";
					return (
						<div
							key={p.id}
							className="flex items-center gap-1.5 border-b border-bd-1 py-[5px] text-[11.5px] last:border-b-0 last:pb-0"
						>
							<Typography tag="span"
								className={cn(
									"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px text-[9.5px] font-semibold",
									pSc.cls,
								)}
							>
								{t(pSc.i18nKey).slice(0, 3).toUpperCase()}
							</Typography>
							<Typography tag="span" className="flex-1 text-t-2">
								{p.subscription?.plan?.name ?? "—"}
							</Typography>
							<Typography tag="span" className={cn("font-semibold", pAmtColor)}>
								{p.status === "REFUNDED" ? "−" : ""}
								{fmtAmount(p)}
							</Typography>
							<Typography tag="span" className="text-[10.5px] text-t-3">
								{new Date(p.createdAt).toLocaleDateString("ru-RU", {
									day: "numeric",
									month: "short",
								})}
							</Typography>
						</div>
					);
				})}
			</div>
		</div>
	);
};
