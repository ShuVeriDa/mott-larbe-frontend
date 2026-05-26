"use client";

import { Typography } from "@/shared/ui/typography";

import {
	FolderForm,
} from "@/entities/folder";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useCreateFolderModal } from "../../model";

export interface CreateFolderModalProps {
	open: boolean;
	onClose: () => void;
	onForbidden?: () => void;
}

export const CreateFolderModal = ({
	open,
	onClose,
	onForbidden,
}: CreateFolderModalProps) => {
	const { t, value, setValue, error, isPending, handleClose, handleSubmit } =
		useCreateFolderModal({
			onClose,
			onForbidden,
		});

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={t("vocabulary.folderModal.title")}
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
						onClick={handleClose}
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
						{t("vocabulary.folderModal.submit")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
