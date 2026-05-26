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
					className="h-[34px] rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("subscription.modal.cancel.keep")}
				</Button>
				<Button
					onClick={handleConfirm}
					disabled={isPending}
					className="h-[34px] flex-1 rounded-lg bg-red text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isPending
						? t("subscription.modal.cancel.submitting")
						: t("subscription.modal.cancel.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
