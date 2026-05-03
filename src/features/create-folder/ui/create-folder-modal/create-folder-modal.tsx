"use client";

import {
	FolderForm,
	buildInitialFolderForm,
	type FolderFormValue,
} from "@/entities/folder";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useState, type SyntheticEvent } from "react";
import { useCreateFolder } from "../../model";

export interface CreateFolderModalProps {
	open: boolean;
	onClose: () => void;
}

export const CreateFolderModal = ({
	open,
	onClose,
}: CreateFolderModalProps) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useCreateFolder();
	const [value, setValue] = useState<FolderFormValue>(() =>
		buildInitialFolderForm(),
	);
	const [error, setError] = useState<string | null>(null);

	const reset = () => {
		setValue(buildInitialFolderForm());
		setError(null);
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleSubmit = async (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>,
	) => {
		e.preventDefault();
		const trimmedName = value.name.trim();
		if (!trimmedName) {
			setError(t("vocabulary.folderModal.errors.nameRequired"));
			return;
		}
		try {
			await mutateAsync({
				name: trimmedName,
				description: value.description.trim() || null,
				color: value.color,
				icon: value.icon,
			});
			reset();
			onClose();
		} catch {
			setError(t("vocabulary.folderModal.errors.createFailed"));
		}
	};

	return (
		<Modal
			open={open}
			onClose={handleClose}
			title={t("vocabulary.folderModal.title")}
		>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
					<p className="text-[12px] text-red" role="alert">
						{error}
					</p>
				) : null}

				<ModalActions>
					<Button
						variant="ghost"
						size="lg"
						className="flex-1"
						onClick={handleClose}
					>
						{t("vocabulary.folderModal.cancel")}
					</Button>
					<Button
						type="submit"
						variant="action"
						size="lg"
						className="flex-1"
						disabled={isPending}
					>
						{t("vocabulary.folderModal.submit")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
