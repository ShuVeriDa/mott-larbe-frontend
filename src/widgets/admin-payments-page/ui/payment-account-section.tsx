"use client";

import { Typography } from "@/shared/ui/typography";
import type { AdminPaymentDetail } from "@/entities/admin-payment";

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
	t: (key: string) => string;
}

export const PaymentAccountSection = ({ payment, t }: Props) => (
	<div className="border-b border-bd-1 px-[15px] py-2.5">
		<div className="mb-[7px] text-[10px] font-semibold uppercase tracking-[0.6px] text-t-3">
			{t("admin.payments.detail.account")}
		</div>
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
					{fmtDate(payment.user.signupAt)}
				</Typography>
			</div>
			<div className="flex items-baseline justify-between gap-2">
				<Typography tag="span" className="text-[11.5px] text-t-3">
					{t("admin.payments.detail.lastSeen")}
				</Typography>
				<Typography tag="span" className="text-[12px] font-medium text-t-1">
					{fmtDate(payment.user.lastActiveAt)}
				</Typography>
			</div>
		</div>
	</div>
);
