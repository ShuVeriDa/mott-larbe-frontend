"use client";

import { CreditCard } from "lucide-react";
import {
	formatPrice,
	usePayments,
	type Payment,
	type PaymentStatus,
} from "@/entities/subscription";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { Badge } from "@/shared/ui/badge";
import { Typography } from "@/shared/ui/typography";
import { SectionCard } from "../section-card";

const STATUS_BADGE: Record<
	PaymentStatus,
	{ variant: "grn" | "amb" | "red" | "neu"; key: string }
> = {
	SUCCEEDED: { variant: "grn", key: "subscription.payments.status.SUCCEEDED" },
	REFUNDED: { variant: "amb", key: "subscription.payments.status.REFUNDED" },
	FAILED: { variant: "red", key: "subscription.payments.status.FAILED" },
	PENDING: { variant: "neu", key: "subscription.payments.status.PENDING" },
};

const formatDate = (iso: string, lang: string): string => {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	return new Intl.DateTimeFormat(lang, {
		day: "numeric",
		month: "short",
		year: "numeric",
	}).format(date);
};

interface PaymentRowProps {
	payment: Payment;
	lang: string;
	tStatus: (key: string) => string;
}

const PaymentRow = ({ payment, lang, tStatus }: PaymentRowProps) => {
	const status = STATUS_BADGE[payment.status];
	const planName = payment.subscription?.plan.name ?? "—";
	const interval = payment.subscription?.plan.interval;

	return (
		<div className="flex items-center gap-2.5 border-hairline border-b border-bd-1 px-4 py-3 transition-colors hover:bg-surf-2 last:border-b-0 max-md:px-3">
			<div
				className={cn(
					"flex size-[30px] shrink-0 items-center justify-center rounded-[8px]",
					payment.status === "REFUNDED" ? "bg-amb-bg" : "bg-acc-bg",
				)}
				aria-hidden="true"
			>
				<CreditCard
					className={cn(
						"size-[13px]",
						payment.status === "REFUNDED" ? "text-amb-t" : "text-acc-t",
					)}
					strokeWidth={1.5}
				/>
			</div>
			<div className="min-w-0 flex-1">
				<Typography
					tag="span"
					className="mb-0.5 block truncate text-[12px] font-medium text-t-1"
				>
					{planName}
					{interval ? ` · ${interval}` : ""}
				</Typography>
				<Typography tag="span" className="block text-[11px] text-t-3">
					{formatDate(payment.createdAt, lang)}
				</Typography>
			</div>
			<Typography
				tag="span"
				className="whitespace-nowrap text-[12.5px] font-semibold text-t-1"
			>
				{formatPrice(payment.amountCents, payment.currency, lang)}
			</Typography>
			<Badge variant={status.variant}>{tStatus(status.key)}</Badge>
		</div>
	);
};

const EmptyState = () => {
	const { t } = useI18n();
	return (
		<div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
			<div className="mb-0.5 flex size-9 items-center justify-center rounded-[9px] bg-surf-2">
				<CreditCard className="size-4 text-t-3" strokeWidth={1.5} />
			</div>
			<Typography
				tag="span"
				className="text-[12.5px] font-medium text-t-1"
			>
				{t("subscription.payments.emptyTitle")}
			</Typography>
			<Typography
				tag="span"
				className="text-[11.5px] leading-[1.5] text-t-3"
			>
				{t("subscription.payments.emptyDesc")}
			</Typography>
		</div>
	);
};

export const PaymentHistory = () => {
	const { t, lang } = useI18n();
	const { data, isLoading, isError } = usePayments({ limit: 10 });

	return (
		<SectionCard title={t("subscription.payments.title")}>
			{isLoading ? (
				<div className="px-4 py-4 text-[12px] text-t-3 max-md:px-3">
					{t("subscription.payments.loading")}
				</div>
			) : isError ? (
				<div className="px-4 py-4 text-[12px] text-red-t max-md:px-3">
					{t("subscription.payments.error")}
				</div>
			) : !data?.items.length ? (
				<EmptyState />
			) : (
				<div className="flex flex-col">
					{data.items.map((payment) => (
						<PaymentRow
							key={payment.id}
							payment={payment}
							lang={lang}
							tStatus={t}
						/>
					))}
				</div>
			)}
		</SectionCard>
	);
};
