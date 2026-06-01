"use client";

import { Typography } from "@/shared/ui/typography";
import { ComponentProps, useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useI18n } from "@/shared/lib/i18n";
import { useDeleteWord } from "../../model";

export interface DeleteWordButtonProps {
	wordId: string;
	word: string;
	className?: string;
}

export const DeleteWordButton = ({
	wordId,
	word,
	className,
}: DeleteWordButtonProps) => {
	const { t } = useI18n();
	const { mutate, isPending } = useDeleteWord();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const handleDeleteClick: NonNullable<ComponentProps<typeof Button>["onClick"]> = (e) => {
		e.stopPropagation();
		setConfirmOpen(true);
	};
	const handleClose: NonNullable<ComponentProps<typeof Modal>["onClose"]> = () => setConfirmOpen(false);
	const handleCancelClick: NonNullable<ComponentProps<typeof Button>["onClick"]> = (e) => {
		e.stopPropagation();
		setConfirmOpen(false);
	};
	const handleConfirmClick: NonNullable<ComponentProps<typeof Button>["onClick"]> = (e) => {
		e.stopPropagation();
		mutate(wordId);
		setConfirmOpen(false);
	};
return (
		<>
			<Button
				variant="danger"
				size="default"
				disabled={isPending}
				onClick={handleDeleteClick}
				className={className}
			>
				{t("vocabulary.card.delete")}
			</Button>

			<Modal
				open={confirmOpen}
				onClose={handleClose}
				title={t("vocabulary.card.delete")}
			>
				<Typography tag="p" className="mb-4 text-[14px] text-t-2">
					{t("vocabulary.wordDetail.deleteConfirm", { word })}
				</Typography>
				<ModalActions>
					<Button
						type="button"
						onClick={handleCancelClick}
						variant="ghost"
						className="h-[34px] px-4 rounded-lg text-[13px]"
					>
						{t("vocabulary.addModal.cancel")}
					</Button>
					<Button
						disabled={isPending}
						onClick={handleConfirmClick}
						variant="bare"
						className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
					>
						{t("vocabulary.folderModal.delete")}
					</Button>
				</ModalActions>
			</Modal>
		</>
	);
};
