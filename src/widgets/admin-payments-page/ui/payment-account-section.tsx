"use client";

import { SectionLabel } from "@/shared/ui/section-label";
import { Typography } from "@/shared/ui/typography";
import type { AdminPaymentDetail } from "@/entities/admin-payment";
import { formatDateLong } from "@/shared/lib/format-date";

interface Props {
	payment: AdminPaymentDetail;
	t: (key: string) => string;
}

export const PaymentAccountSection = ({ payment, t }: Props) => (
	<div className="border-b border-bd-1 px-[15px] py-2.5">
		<SectionLabel className="mb-[7px]">
			{t("admin.payments.detail.account")}
		</SectionLabel>
		<div className="space-y-1.5">
			<div className="flex items-baseline justify-between gap-2">
				<Typography tag="span" className="text-[11.5px] text-t-3">
					{t("admin.payments.detail.userId")}
				</Typography>
				<Typography tag="span" className="font-mono text-[11px] text-t-3">
					{payment.user.id.slice(0, 16)}…
				</Typography>
			</div>
			<div className="flex items-baseline justify-between gap-2">
				<Typography tag="span" className="text-[11.5px] text-t-3">
					{t("admin.payments.detail.registered")}
				</Typography>
				<Typography tag="span" className="text-[12px] font-medium text-t-1">
					{formatDateLong(payment.user.signupAt)}
				</Typography>
			</div>
			<div className="flex items-baseline justify-between gap-2">
				<Typography tag="span" className="text-[11.5px] text-t-3">
					{t("admin.payments.detail.lastSeen")}
				</Typography>
				<Typography tag="span" className="text-[12px] font-medium text-t-1">
					{formatDateLong(payment.user.lastActiveAt)}
				</Typography>
			</div>
		</div>
	</div>
);
