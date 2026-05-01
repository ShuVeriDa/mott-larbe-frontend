"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Typography } from "@/shared/ui/typography";
import { usePayments, formatPrice, type Payment } from "@/entities/subscription";
import { ProfileCard as SettingCard } from "../profile-card";

const CardIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-4 text-t-3">
		<rect x="1.5" y="3.5" width="13" height="9" rx="1.5" />
		<path d="M1.5 6.5h13" strokeLinecap="round" />
		<path d="M4 9.5h3" strokeLinecap="round" />
	</svg>
);

const STATUS_STYLE: Record<Payment["status"], string> = {
	SUCCEEDED: "text-grn-t bg-grn-bg",
	PENDING: "text-amb-t bg-amb-bg",
	FAILED: "text-red bg-red-bg",
	REFUNDED: "text-t-2 bg-surf-2",
};

export const PaymentHistoryCard = () => {
	const { t } = useI18n();
	const { data } = usePayments({ limit: 5 });
	const payments = data?.items ?? [];

	return (
		<SettingCard title={t("profile.subscription.paymentHistory")} noBody>
			{payments.length === 0 ? (
				<div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
					<span className="flex size-9 items-center justify-center rounded-[9px] bg-surf-2">
						<CardIcon />
					</span>
					<Typography tag="p" className="text-[12.5px] font-medium text-t-1">
						{t("profile.subscription.noPayments")}
					</Typography>
					<Typography tag="p" className="text-[11.5px] text-t-3 leading-normal">
						{t("profile.subscription.noPaymentsDesc")}
					</Typography>
				</div>
			) : (
				payments.map((p) => (
					<div
						key={p.id}
						className="flex items-center gap-3 border-b border-hairline border-bd-1 px-4 py-2.5 last:border-b-0"
					>
						<div className="flex-1 min-w-0">
							<Typography tag="p" className="text-[12.5px] font-medium text-t-1 truncate">
								{p.subscription?.plan.name ?? t("profile.subscription.payment")}
							</Typography>
							<Typography tag="p" className="text-[11px] text-t-3">
								{new Date(p.createdAt).toLocaleDateString()}
							</Typography>
						</div>
						<span className="text-[12.5px] font-semibold text-t-1 shrink-0">
							{formatPrice(p.amountCents, p.currency)}
						</span>
						<span className={`px-1.5 py-0.5 rounded text-[10.5px] font-medium shrink-0 ${STATUS_STYLE[p.status]}`}>
							{t(`profile.subscription.status.${p.status.toLowerCase()}`)}
						</span>
					</div>
				))
			)}
		</SettingCard>
	);
};
