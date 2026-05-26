"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import {
	FolderForm,
	type Folder,
} from "@/entities/folder";
import { useEditFolderModal } from "../../model";

export interface EditFolderModalProps {
	open: boolean;
	folder: Folder | null;
	onClose: () => void;
}

export const EditFolderModal = ({
	open,
	folder,
	onClose,
}: EditFolderModalProps) => {
	const { t, value, setValue, error, isPending, handleSubmit } =
		useEditFolderModal({
			folder,
			onClose,
		});

	if (!folder) return null;

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.folderModal.editTitle")}
		>
			<form action={handleSubmit} className="flex flex-col gap-4">
				<FolderForm
					value={value}
					onChange={setValue}
					autoFocusName
					labels={{
						nameLabel: t("vocabulary.folderModal.nameLabel"),
						namePlaceholder: t("vocabulary.folderModal.namePlaceholder"),
						descriptionLabel: t("vocabulary.folderModal.descriptionLabel"),
						descriptionPlaceholder: t(
							"vocabulary.folderModal.descriptionPlaceholder",
						),
						colorLabel: t("vocabulary.folderModal.colorLabel"),
						iconLabel: t("vocabulary.folderModal.iconLabel"),
					}}
				/>

				{error ? (
					<Typography tag="p" className="text-[12px] text-red" role="alert">
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
						type="submit"
						disabled={isPending}
						variant="action"
						className="h-[34px] px-4 rounded-lg text-[13px] flex-1"
					>
						{t("vocabulary.folderModal.save")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
