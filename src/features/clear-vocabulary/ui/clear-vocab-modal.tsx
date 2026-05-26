"use client";

import { useClearVocabulary } from "@/entities/settings";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { Typography } from "@/shared/ui/typography";

export interface ClearVocabModalProps {
	open: boolean;
	onClose: () => void;
}

export const ClearVocabModal = ({ open, onClose }: ClearVocabModalProps) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useClearVocabulary();
	const { success } = useToast();

	const handleConfirm = async () => {
		try {
			await mutateAsync();
			success(t("settings.toasts.vocabCleared"));
			onClose();
		} catch {}
	};

	return (
		<Modal open={open} onClose={onClose} title={t("settings.clearVocabModal.title")}>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3 leading-[1.55]">
				{t("settings.clearVocabModal.desc")}
			</Typography>
			<ModalActions>
				<Button
					onClick={onClose}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("settings.clearVocabModal.cancel")}
				</Button>
				<Button
					disabled={isPending}
					onClick={handleConfirm}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
				>
					{t("settings.clearVocabModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
