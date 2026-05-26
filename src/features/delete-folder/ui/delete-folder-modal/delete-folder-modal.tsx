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
					className="h-[34px] rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
				>
					{t("vocabulary.folderModal.cancel")}
				</Button>
				<Button
					onClick={handleDelete}
					disabled={isPending}
					className="h-[34px] flex-1 rounded-lg bg-red text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{t("vocabulary.folderModal.delete")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
