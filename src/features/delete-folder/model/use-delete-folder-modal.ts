"use client";

import { useState } from "react";
import type { Folder } from "@/entities/folder";
import { useI18n } from "@/shared/lib/i18n";
import { useDeleteFolder } from "./use-delete-folder";

interface UseDeleteFolderModalParams {
	folder: Folder | null;
	onClose: () => void;
	onDeleted?: () => void;
}

export const useDeleteFolderModal = ({
	folder,
	onClose,
	onDeleted,
}: UseDeleteFolderModalParams) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useDeleteFolder();
	const [error, setError] = useState<string | null>(null);

	const handleDelete = async () => {
		if (!folder) return;

		try {
			await mutateAsync(folder.id);
			onClose();
			onDeleted?.();
		} catch {
			setError(t("vocabulary.folderModal.errors.deleteFailed"));
		}
	};

	return {
		t,
		error,
		isPending,
		handleDelete,
	};
};
