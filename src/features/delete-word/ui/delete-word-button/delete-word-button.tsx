"use client";

import { useState } from "react";
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

	return (
		<>
			<Button
				variant="danger"
				size="default"
				disabled={isPending}
				onClick={(e) => {
					e.stopPropagation();
					setConfirmOpen(true);
				}}
				className={className}
			>
				{t("vocabulary.card.delete")}
			</Button>

			<Modal
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				title={t("vocabulary.card.delete")}
			>
				<p className="mb-4 text-[14px] text-t-2">
					{t("vocabulary.wordDetail.deleteConfirm", { word })}
				</p>
				<ModalActions>
					<Button
						variant="ghost"
						size="lg"
						className="flex-1"
						onClick={(e) => {
							e.stopPropagation();
							setConfirmOpen(false);
						}}
					>
						{t("vocabulary.addModal.cancel")}
					</Button>
					<Button
						variant="danger"
						size="lg"
						className="flex-1"
						disabled={isPending}
						onClick={(e) => {
							e.stopPropagation();
							mutate(wordId);
							setConfirmOpen(false);
						}}
					>
						{t("vocabulary.folderModal.delete")}
					</Button>
				</ModalActions>
			</Modal>
		</>
	);
};
