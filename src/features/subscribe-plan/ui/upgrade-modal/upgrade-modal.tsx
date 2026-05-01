"use client";

import {
	formatPrice,
	type BillingCycle,
	type Plan,
} from "@/entities/subscription";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";
import { useSubscribePlan } from "../../model";

export interface UpgradeModalProps {
	plan: Plan | null;
	cycle: BillingCycle;
	open: boolean;
	onClose: () => void;
	onSuccess?: (plan: Plan) => void;
}

export const UpgradeModal = ({
	plan,
	cycle,
	open,
	onClose,
	onSuccess,
}: UpgradeModalProps) => {
	const { t, lang } = useI18n();
	const { mutateAsync, isPending } = useSubscribePlan();

	if (!plan) return null;

	const price = formatPrice(plan.priceCents, plan.currency, lang);
	const periodKey =
		cycle === "yearly"
			? "subscription.modal.upgrade.periodYearly"
			: "subscription.modal.upgrade.periodMonthly";
	const noteKey =
		cycle === "yearly"
			? "subscription.modal.upgrade.noteYearly"
			: "subscription.modal.upgrade.noteMonthly";

	const handleConfirm = async () => {
		try {
			await mutateAsync({ planId: plan.id });
			onSuccess?.(plan);
			onClose();
		} catch {
			// error surfaced via mutation state
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("subscription.modal.upgrade.title", { plan: plan.name })}
		>
			<Typography className="mb-4 text-[12.5px] leading-[1.55] text-t-3">
				{t("subscription.modal.upgrade.subtitle")}
			</Typography>

			<div className="mb-4 rounded-[9px] border-hairline border-bd-1 bg-surf-2 p-3.5">
				<Typography
					tag="span"
					className="mb-1 block text-[13.5px] font-semibold text-t-1"
				>
					{plan.name}
				</Typography>
				<Typography tag="span" className="block text-[22px] font-bold text-t-1">
					{price}{" "}
					<Typography tag="span" className="text-[13px] font-normal text-t-3">
						{t(periodKey)}
					</Typography>
				</Typography>
				<Typography tag="span" className="mt-0.5 block text-[11px] text-t-3">
					{t(noteKey)}
				</Typography>
			</div>

			<ModalActions className="justify-end">
				<Button variant="ghost" onClick={onClose} disabled={isPending}>
					{t("subscription.modal.upgrade.cancel")}
				</Button>
				<Button variant="action" onClick={handleConfirm} disabled={isPending}>
					{isPending
						? t("subscription.modal.upgrade.submitting")
						: t("subscription.modal.upgrade.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
