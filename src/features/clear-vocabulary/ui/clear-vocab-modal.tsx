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
	const { success, error } = useToast();

	const handleConfirm = async () => {
		try {
			await mutateAsync();
			success(t("settings.toasts.vocabCleared"));
			onClose();
		} catch {
			error(t("settings.toasts.genericError"));
		}
	};

	return (
		<Modal open={open} onClose={onClose} title={t("settings.clearVocabModal.title")}>
			<Typography tag="p" className="mb-4 text-[12px] text-t-3 leading-[1.55]">
				{t("settings.clearVocabModal.desc")}
			</Typography>
			<ModalActions>
				<Button variant="ghost" className="flex-1" size="lg" onClick={onClose}>
					{t("settings.clearVocabModal.cancel")}
				</Button>
				<Button
					variant="action"
					size="lg"
					className="flex-1 !bg-red"
					disabled={isPending}
					onClick={handleConfirm}
				>
					{t("settings.clearVocabModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
