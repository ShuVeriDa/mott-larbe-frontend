"use client";

import { useState } from "react";
import {
	buildInitialFolderForm,
	type FolderFormValue,
} from "@/entities/folder";
import { useI18n } from "@/shared/lib/i18n";
import { getApiErrorCode } from "@/shared/api/http";
import { useCreateFolder } from "./use-create-folder";

interface UseCreateFolderModalParams {
	onClose: () => void;
	onForbidden?: () => void;
}

export const useCreateFolderModal = ({
	onClose,
	onForbidden,
}: UseCreateFolderModalParams) => {
	const { t } = useI18n();
	const { mutateAsync, isPending } = useCreateFolder();
	const [value, setValue] = useState<FolderFormValue>(() => buildInitialFolderForm());
	const [error, setError] = useState<string | null>(null);

	const reset = () => {
		setValue(buildInitialFolderForm());
		setError(null);
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	const handleSubmit = async () => {
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
		} catch (errorValue) {
			const code = getApiErrorCode(errorValue);
			if (code === "SUBSCRIPTION_REQUIRED" || code === "SUBSCRIPTION_EXPIRED" || code === "FOLDER_LIMIT_REACHED") {
				handleClose();
				onForbidden?.();
				return;
			}
			setError(t("vocabulary.folderModal.errors.createFailed"));
		}
	};

	return {
		t,
		value,
		setValue,
		error,
		isPending,
		handleClose,
		handleSubmit,
	};
};
