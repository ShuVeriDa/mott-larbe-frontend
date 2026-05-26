"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import type { Folder } from "@/entities/folder";
import { useDeleteFolderModal } from "../../model";

export interface DeleteFolderModalProps {
	open: boolean;
	folder: Folder | null;
	onClose: () => void;
	onDeleted?: () => void;
}

export const DeleteFolderModal = ({
	open,
	folder,
	onClose,
	onDeleted,
}: DeleteFolderModalProps) => {
	const { t, error, isPending, handleDelete } = useDeleteFolderModal({
		folder,
		onClose,
		onDeleted,
	});

	if (!folder) return null;

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.folderModal.deleteTitle")}
		>
			<Typography tag="p" className="mb-4 text-[13px] leading-[1.55] text-t-2">
				{t("vocabulary.folderModal.deleteConfirm", { name: folder.name })}
			</Typography>

			{error ? (
				<Typography tag="p" className="mb-3 text-[12px] text-red" role="alert">
					{error}
				</Typography>
			) : null}

			<ModalActions>
				<Button
					onClick={onClose}
					variant="ghost"
					className="h-[34px] px-4 rounded-lg text-[13px]"
				>
					{t("vocabulary.folderModal.cancel")}
				</Button>
				<Button
					onClick={handleDelete}
					disabled={isPending}
					variant="bare"
					className="h-[34px] px-4 rounded-lg text-[13px] font-semibold text-white bg-red hover:opacity-85 flex-1"
				>
					{t("vocabulary.folderModal.delete")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
