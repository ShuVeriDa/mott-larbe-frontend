"use client";

import { ReactNode } from 'react';
import type {
	AdminPaymentListItem,
	PaymentBackendStatus,
	PaymentProvider,
} from "@/entities/admin-payment";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";

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

const fmtDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

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
	payment: AdminPaymentListItem;
	onClose: () => void;
}

export const PaymentReceiptModal = ({ payment, onClose }: Props) => {
	const { t } = useI18n();

	const sc = STATUS_CFG[payment.status] ?? STATUS_CFG.PENDING;
	const provColor = PROVIDER_COLORS[payment.provider] ?? "#a5a39a";
	const amtStr = fmtAmount(payment);
	const amtColor =
		payment.status === "SUCCEEDED"
			? "text-t-1"
			: payment.status === "REFUNDED"
				? "text-red-t"
				: "text-t-3";

	const rows: { key: string; value: ReactNode }[] = [
		{
			key: t("admin.payments.receipt.txId"),
			value: (
				<span className="font-mono text-[11px] text-t-2">
					{payment.providerPaymentId}
				</span>
			),
		},
		{
			key: t("admin.payments.receipt.date"),
			value: fmtDate(payment.createdAt),
		},
		{
			key: t("admin.payments.receipt.user"),
			value: `${payment.user.name} ${payment.user.surname}`,
		},
		{ key: t("admin.payments.receipt.email"), value: payment.user.email },
		{
			key: t("admin.payments.receipt.plan"),
			value: payment.subscription?.plan?.name ?? "—",
		},
		{
			key: t("admin.payments.receipt.provider"),
			value: (
				<span className="inline-flex items-center gap-1 rounded border border-bd-2 bg-surf-2 px-1.5 py-px text-[11px] font-medium text-t-2">
					<span
						className="size-1.5 rounded-full"
						style={{ background: provColor }}
					/>
					{payment.provider}
				</span>
			),
		},
		{
			key: t("admin.payments.receipt.status"),
			value: (
				<span
					className={cn(
						"inline-flex items-center gap-1 rounded-[5px] px-1.5 py-px text-[10.5px] font-semibold",
						sc.cls,
					)}
				>
					<span className={cn("size-[5px] rounded-full", sc.dotCls)} />
					{t(sc.i18nKey)}
				</span>
			),
		},
	];

	return (
		<div className="overflow-hidden rounded-t-[14px] bg-surf sm:rounded-[14px]">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<span className="font-display text-[14px] font-semibold text-t-1">
					{t("admin.payments.receipt.title")}
				</span>
				<button
					type="button"
					onClick={onClose}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
					>
						<path d="M1 1l10 10M11 1 1 11" />
					</svg>
				</button>
			</div>

			{/* Body */}
			<div className="px-4 py-3.5">
				<div className="mb-2.5 overflow-hidden rounded-[9px] border border-bd-1 bg-surf-2">
					{rows.map(({ key, value }, i) => (
						<div
							key={i}
							className="flex items-center justify-between border-b border-bd-1 px-3 py-2 text-[12.5px] last:border-b-0"
						>
							<span className="text-t-3">{key}</span>
							<span className="font-medium text-t-1">{value}</span>
						</div>
					))}
				</div>

				<div className="flex items-center justify-between px-1 text-[13px] font-semibold text-t-1">
					<span>{t("admin.payments.receipt.total")}</span>
					<span className={amtColor}>
						{payment.status === "REFUNDED" ? "−" : ""}
						{amtStr}
					</span>
				</div>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
				<button
					type="button"
					onClick={onClose}
					className="flex h-[32px] items-center rounded-lg border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("admin.payments.receipt.close")}
				</button>
				<button
					type="button"
					disabled
					title={t("admin.payments.receipt.copyLinkUnavailable")}
					className="flex h-[32px] cursor-not-allowed items-center rounded-lg bg-acc px-4 text-[12.5px] font-semibold text-white opacity-40"
				>
					{t("admin.payments.receipt.copyLink")}
				</button>
			</div>
		</div>
	);
};
