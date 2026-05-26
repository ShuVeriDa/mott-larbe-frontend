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
						className="h-[34px] rounded-lg border-[0.5px] border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
					>
						{t("vocabulary.folderModal.cancel")}
					</Button>
					<Button
						type="submit"
						disabled={isPending}
						className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{t("vocabulary.folderModal.save")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
