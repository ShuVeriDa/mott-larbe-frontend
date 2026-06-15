"use client";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";
import type { AdminSubscriptionDetail, PaymentProvider } from "@/entities/admin-subscription";
import { formatDateCompact } from "@/shared/lib/format-date";

const PROVIDER_COLORS: Record<PaymentProvider, string> = {
	STRIPE: "#635bff",
	PAYPAL: "#0070ba",
	PADDLE: "#07a3b1",
	LEMONSQUEEZY: "#f6b60d",
	MANUAL: "#a5a39a",
};

const formatAmount = (cents: number, currency: string) =>
	`${(cents / 100).toLocaleString("ru-RU")} ${currency}`;

const SectionTitle = ({ label }: { label: string }) => (
	<SectionLabel className="mb-[7px]">{label}</SectionLabel>
);

interface Props {
	sub: AdminSubscriptionDetail;
	sectionTitle: string;
}

export const SubscriptionPaymentsSection = ({ sub, sectionTitle }: Props) => {
	if (sub.payments.length === 0) return null;

	return (
		<div className="border-b border-bd-1 px-[15px] py-2.5">
			<SectionTitle label={sectionTitle} />
			<div className="space-y-0">
				{sub.payments.map((p) => (
					<div
						key={p.id}
						className="flex items-center gap-1.5 border-b border-bd-1 py-[5px] text-[12px] last:border-b-0 last:pb-0"
					>
						<div
							className="size-1.5 shrink-0 rounded-full"
							style={{ background: PROVIDER_COLORS[p.provider] ?? "#a5a39a" }}
						/>
						<Typography tag="span" className="flex-1 font-medium text-t-1">
							{formatAmount(p.amountCents, p.currency)}
						</Typography>
						{p.refundedCents > 0 && (
							<Typography tag="span" className="text-[10.5px] text-red-t">
								−{formatAmount(p.refundedCents, p.currency)}
							</Typography>
						)}
						<Typography tag="span" className="text-[10.5px] text-t-3">
							{formatDateCompact(p.createdAt)}
						</Typography>
					</div>
				))}
			</div>
		</div>
	);
};
