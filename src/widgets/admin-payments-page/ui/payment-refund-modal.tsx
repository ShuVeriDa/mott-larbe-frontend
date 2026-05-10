"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import type {
	AdminPaymentListItem,
	RefundReason,
} from "@/entities/admin-payment";
import { useI18n } from "@/shared/lib/i18n";
import { ComponentProps, useState } from "react";
const REASONS: RefundReason[] = [
	"USER_REQUEST",
	"DUPLICATE_TRANSACTION",
	"CHARGE_ERROR",
	"OTHER",
];

interface Props {
	payment: AdminPaymentListItem;
	isPending: boolean;
	onClose: () => void;
	onSubmit: (amountCents: number, reason: RefundReason) => void;
}

export const PaymentRefundModal = ({
	payment,
	isPending,
	onClose,
	onSubmit,
}: Props) => {
	const { t } = useI18n();

	const maxRub = payment.amountCents / 100;
	const [amount, setAmount] = useState(String(maxRub));
	const [reason, setReason] = useState<RefundReason>("USER_REQUEST");

	const handleSubmit = () => {
		const cents = Math.round(parseFloat(amount) * 100);
		if (!cents || cents <= 0 || cents > payment.amountCents) return;
		onSubmit(cents, reason);
	};

	const fmtUser = `${payment.user.name} ${payment.user.surname}`;
	const fmtPlan = payment.subscription?.plan?.name ?? "—";
	const fmtOrig = new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: payment.currency || "RUB",
		maximumFractionDigits: 0,
	}).format(maxRub);

		const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setAmount(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e => setReason(e.currentTarget.value as RefundReason);
return (
		<div className="overflow-hidden rounded-t-[14px] bg-surf sm:rounded-[14px]">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<Typography tag="span" className="font-display text-[14px] font-semibold text-t-1">
					{t("admin.payments.refundModal.title")}
				</Typography>
				<Button
					onClick={onClose}
					className="flex size-[26px] items-center justify-center rounded-base bg-surf-2 text-t-2 transition-colors hover:bg-surf-3"
				>
					<X className="size-3" />
				</Button>
			</div>

			{/* Body */}
			<form action={handleSubmit}>
				<div className="px-4 py-3.5">
					{/* Payment summary */}
					<div className="mb-3 rounded-lg border border-bd-1 bg-surf-2 px-3 py-2.5 text-[12.5px] text-t-2">
						<Typography tag="span" className="font-semibold text-t-1">{fmtUser}</Typography>
						{" · "}
						{fmtPlan}
						{" · "}
						<Typography tag="span" className="font-semibold text-t-1">{fmtOrig}</Typography>
					</div>

					{/* Amount */}
					<div className="mb-3">
						<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
							{t("admin.payments.refundModal.amountLabel")}
						</Typography>
						<input
							type="number"
							step="0.01"
							min="0.01"
							max={maxRub}
							value={amount}
							onChange={handleChange}
							required
							className="h-[34px] w-full rounded-lg border border-bd-2 bg-surf-2 px-2.5 text-[13px] text-t-1 outline-none transition-colors focus:border-acc focus:bg-surf"
						/>
					</div>

					{/* Reason */}
					<div>
						<Typography tag="label" className="mb-1.5 block text-[11.5px] font-medium text-t-2">
							{t("admin.payments.refundModal.reasonLabel")}
						</Typography>
						<select
							value={reason}
							onChange={handleChange2}
							className="h-[34px] w-full appearance-none rounded-lg border border-bd-2 bg-surf-2 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%226%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M1%201l4%204%204-4%22%20stroke%3D%22%23a5a39a%22%20stroke-width%3D%221.3%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_10px_center] pl-2.5 pr-7 text-[13px] text-t-1 outline-none transition-colors focus:border-acc"
						>
							{REASONS.map(r => (
								<option key={r} value={r}>
									{t(`admin.payments.refundModal.reasons.${r}`)}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
					<Button
						onClick={onClose}
						disabled={isPending}
						className="flex h-[32px] items-center rounded-lg border border-bd-2 bg-surf-2 px-3.5 text-[12.5px] font-medium text-t-2 transition-colors hover:bg-surf-3 disabled:opacity-60"
					>
						{t("admin.payments.refundModal.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isPending}
						className="flex h-[32px] items-center rounded-lg bg-red px-4 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-88 disabled:opacity-60"
					>
						{isPending
							? t("admin.payments.refundModal.loading")
							: t("admin.payments.refundModal.confirm")}
					</Button>
				</div>
			</form>
		</div>
	);
};
