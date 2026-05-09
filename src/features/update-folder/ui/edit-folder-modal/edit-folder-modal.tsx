"use client";
import { type SyntheticEvent, useEffect, useState } from 'react';
import { Button } from "@/shared/ui/button";
import { Modal, ModalActions } from "@/shared/ui/modal";
import { useI18n } from "@/shared/lib/i18n";
import {
	FolderForm,
	buildInitialFolderForm,
	isFolderIconKey,
	type Folder,
	type FolderFormValue,
	type FolderIconKey,
} from "@/entities/folder";
import { useUpdateFolder } from "../../model";

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
	const { t } = useI18n();
	const { mutateAsync, isPending } = useUpdateFolder();
	const [value, setValue] = useState<FolderFormValue>(() =>
		buildInitialFolderForm(),
	);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!folder) return;
		const icon: FolderIconKey = isFolderIconKey(folder.icon)
			? folder.icon
			: "book";
		setValue({
			name: folder.name,
			description: folder.description ?? "",
			color: folder.color ?? buildInitialFolderForm().color,
			icon,
		});
		setError(null);
	}, [folder]);

	if (!folder) return null;

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
				id: folder.id,
				body: {
					name: trimmedName,
					description: value.description.trim() || null,
					color: value.color,
					icon: value.icon,
				},
			});
			onClose();
		} catch {
			setError(t("vocabulary.folderModal.errors.saveFailed"));
		}
	};

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={t("vocabulary.folderModal.editTitle")}
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
						onClick={onClose}
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
						{t("vocabulary.folderModal.save")}
					</Button>
				</ModalActions>
			</form>
		</Modal>
	);
};
