"use client";

import { useResetProgress } from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";

export interface ResetProgressModalProps {
	open: boolean;
	onClose: () => void;
}

export const ResetProgressModal = ({
	open,
	onClose,
}: ResetProgressModalProps) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useResetProgress();
	const { success, error } = useToast();

	const handleConfirm = async () => {
		try {
			await mutateAsync();
			success(t("settings.toasts.progressReset"));
			onClose();
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	return (
		<Modal open={open} onClose={onClose} title={t("settings.resetProgressModal.title")}>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3 leading-[1.55]">
				{t("settings.resetProgressModal.desc")}
			</Typography>
			<ModalActions>
				<Button variant="ghost" className="flex-1" size="lg" onClick={onClose}>
					{t("settings.resetProgressModal.cancel")}
				</Button>
				<Button
					variant="action"
					size="lg"
					className="flex-1 !bg-red"
					disabled={isPending}
					onClick={handleConfirm}
				>
					{t("settings.resetProgressModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
