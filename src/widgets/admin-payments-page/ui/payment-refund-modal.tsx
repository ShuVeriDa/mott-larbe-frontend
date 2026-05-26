"use client";

import type {
	AdminPaymentListItem,
	RefundReason,
} from "@/entities/admin-payment";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Typography } from "@/shared/ui/typography";
import { X } from "lucide-react";
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

	const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		setAmount(e.currentTarget.value);
	const handleChange2: NonNullable<ComponentProps<"select">["onChange"]> = e =>
		setReason(e.currentTarget.value as RefundReason);
	return (
		<div className="overflow-hidden rounded-t-[14px] bg-surf sm:rounded-[14px]">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-bd-1 px-4 py-3.5">
				<Typography
					tag="span"
					className="font-display text-[14px] font-semibold text-t-1"
				>
					{t("admin.payments.refundModal.title")}
				</Typography>
				<Button
					size={"bare"}
					onClick={onClose}
					title={t("admin.payments.refundModal.cancel")}
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
						<Typography tag="span" className="font-semibold text-t-1">
							{fmtUser}
						</Typography>
						{" · "}
						{fmtPlan}
						{" · "}
						<Typography tag="span" className="font-semibold text-t-1">
							{fmtOrig}
						</Typography>
					</div>

					{/* Amount */}
					<div className="mb-3">
						<Typography
							tag="label"
							className="mb-1.5 block text-[11.5px] font-medium text-t-2"
						>
							{t("admin.payments.refundModal.amountLabel")}
						</Typography>
						<Input
							type="number"
							step="0.01"
							min="0.01"
							max={maxRub}
							value={amount}
							onChange={handleChange}
							required
							aria-label={t("admin.payments.refundModal.amountLabel")}
							className="rounded-lg focus:bg-surf"
						/>
					</div>

					{/* Reason */}
					<div>
						<Typography
							tag="label"
							className="mb-1.5 block text-[11.5px] font-medium text-t-2"
						>
							{t("admin.payments.refundModal.reasonLabel")}
						</Typography>
						<Select
							variant="lg"
							value={reason}
							onChange={handleChange2}
							className="rounded-lg"
						>
							{REASONS.map(r => (
								<option key={r} value={r}>
									{t(`admin.payments.refundModal.reasons.${r}`)}
								</option>
							))}
						</Select>
					</div>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-2 border-t border-bd-1 px-4 py-3">
					<Button
						onClick={onClose}
						disabled={isPending}
						title={t("admin.payments.refundModal.cancel")}
						variant="ghost"
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("admin.payments.refundModal.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isPending}
						title={isPending ? t("admin.payments.refundModal.loading") : t("admin.payments.refundModal.confirm")}
						variant="bare"
						className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85"
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
