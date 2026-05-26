"use client";

import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";
import { useCancelSubscription } from "../../model";

export interface CancelModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export const CancelModal = ({ open, onClose, onSuccess }: CancelModalProps) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useCancelSubscription();

	const handleConfirm = async () => {
		try {
			await mutateAsync();
			onSuccess?.();
			onClose();
		} catch {
			// surfaced via mutation state
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("subscription.modal.cancel.title")}
		>
			<Typography className="mb-4 text-[12.5px] leading-[1.55] text-t-3">
				{t("subscription.modal.cancel.subtitle")}
			</Typography>
			<ModalActions>
				<Button
					onClick={onClose}
					disabled={isPending}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("subscription.modal.cancel.keep")}
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={isPending}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
				>
					{isPending
						? t("subscription.modal.cancel.submitting")
						: t("subscription.modal.cancel.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
