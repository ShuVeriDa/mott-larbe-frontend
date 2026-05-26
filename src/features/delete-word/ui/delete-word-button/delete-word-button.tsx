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

		const handleClick: NonNullable<ComponentProps<typeof Button>["onClick"]> = (e) => {
					e.stopPropagation();
					setConfirmOpen(true);
				};
	const handleClose: NonNullable<ComponentProps<typeof Modal>["onClose"]> = () => setConfirmOpen(false);
	const handleClick2: NonNullable<ComponentProps<typeof Button>["onClick"]> = (e) => {
							e.stopPropagation();
							setConfirmOpen(false);
						};
	const handleClick3: NonNullable<ComponentProps<typeof Button>["onClick"]> = (e) => {
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
				onClick={handleClick}
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
						onClick={handleClick2}
						className="h-[34px] rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
					>
						{t("vocabulary.addModal.cancel")}
					</Button>
					<Button
						disabled={isPending}
						onClick={handleClick3}
						className="h-[34px] flex-1 rounded-lg bg-red text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{t("vocabulary.folderModal.delete")}
					</Button>
				</ModalActions>
			</Modal>
		</>
	);
};
