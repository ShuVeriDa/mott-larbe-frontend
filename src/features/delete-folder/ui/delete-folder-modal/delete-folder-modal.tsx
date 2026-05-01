"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useI18n } from "@/shared/lib/i18n";
import type { Folder } from "@/entities/folder";
import { useDeleteFolder } from "../../model";

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
	const { t } = useI18n();
	const { mutateAsync, isPending } = useDeleteFolder();
	const [error, setError] = useState<string | null>(null);

	if (!folder) return null;

	const handleDelete = async () => {
		try {
			await mutateAsync(folder.id);
			onClose();
			onDeleted?.();
		} catch {
			setError(t("vocabulary.folderModal.errors.deleteFailed"));
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.folderModal.deleteTitle")}
		>
			<p className="mb-4 text-[13px] leading-[1.55] text-t-2">
				{t("vocabulary.folderModal.deleteConfirm", { name: folder.name })}
			</p>

			{error ? (
				<p className="mb-3 text-[12px] text-red" role="alert">
					{error}
				</p>
			) : null}

			<ModalActions>
				<Button variant="ghost" size="lg" className="flex-1" onClick={onClose}>
					{t("vocabulary.folderModal.cancel")}
				</Button>
				<Button
					variant="danger"
					size="lg"
					className="flex-1"
					onClick={handleDelete}
					disabled={isPending}
				>
					{t("vocabulary.folderModal.delete")}
				</Button>
			</ModalActions>
		</Modal>
	);
};
