"use client";

import { useEffect, useState } from "react";
import {
	buildInitialFolderForm,
	isFolderIconKey,
	type Folder,
	type FolderFormValue,
	type FolderIconKey,
} from "@/entities/folder";
import { useI18n } from "@/shared/lib/i18n";
import { useUpdateFolder } from "./use-update-folder";

interface UseEditFolderModalParams {
	folder: Folder | null;
	onClose: () => void;
}

export const useEditFolderModal = ({
	folder,
	onClose,
}: UseEditFolderModalParams) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useUpdateFolder();
	const [value, setValue] = useState<FolderFormValue>(() => buildInitialFolderForm());
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!folder) return;

		const icon: FolderIconKey = isFolderIconKey(folder.icon)
			? folder.icon
			: "book";
		// Keep local draft in sync when another folder is selected.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setValue({
			name: folder.name,
			description: folder.description ?? "",
			color: folder.color ?? buildInitialFolderForm().color,
			icon,
		});
		setError(null);
	}, [folder]);

	const handleSubmit = async () => {
		if (!folder) return;

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

	return {
		t,
		value,
		setValue,
		error,
		isPending,
		handleSubmit,
	};
};
