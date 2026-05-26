"use client";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import type { TextPhraseOccurrence } from "@/entities/text-phrase";
import { Modal, ModalActions } from "@/shared/ui/modal";

interface PhraseOccurrenceDeleteModalProps {
	occurrence: TextPhraseOccurrence | null;
	isDeleting: boolean;
	onConfirm: () => void;
	onClose: () => void;
	t: (key: string, vars?: Record<string, string | number>) => string;
}

export const PhraseOccurrenceDeleteModal = ({
	occurrence,
	isDeleting,
	onConfirm,
	onClose,
	t,
}: PhraseOccurrenceDeleteModalProps) => {
	return (
		<Modal
			open={!!occurrence}
			onClose={onClose}
			title={t("admin.textPhrases.deleteOccurrenceModal.title")}
			className="max-w-[400px]"
		>
			<Typography tag="p" className="mb-4 text-[12.5px] text-t-3">
				{t("admin.textPhrases.deleteOccurrenceModal.subtitle", {
					title: occurrence?.text.title ?? "",
				})}
			</Typography>

			<ModalActions>
				<Button
					onClick={onClose}
					disabled={isDeleting}
					title={t("admin.textPhrases.deleteOccurrenceModal.cancel")}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("admin.textPhrases.deleteOccurrenceModal.cancel")}
				</Button>
				<Button
					onClick={onConfirm}
					disabled={isDeleting}
					title={isDeleting ? t("admin.textPhrases.deleteOccurrenceModal.deleting") : t("admin.textPhrases.deleteOccurrenceModal.confirm")}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
				>
					{isDeleting
						? t("admin.textPhrases.deleteOccurrenceModal.deleting")
						: t("admin.textPhrases.deleteOccurrenceModal.confirm")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
