"use client";

import { useQuery } from "@tanstack/react-query";
import { type ComponentProps, useState } from "react";
import { dictionaryApi, dictionaryKeys } from "@/entities/dictionary";
import { useI18n } from "@/shared/lib/i18n";
import { useAssignEntriesToFolder } from "./use-assign-folder";

interface UseDistributeAllModalParams {
	onClose: () => void;
	open: boolean;
}

export const useDistributeAllModal = ({
	onClose,
	open,
}: UseDistributeAllModalParams) => {
	const { t } = useI18n();
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const { mutate: assign, isPending } = useAssignEntriesToFolder();

	const { data: uncatData, isLoading: loadingEntries } = useQuery({
		queryKey: dictionaryKeys.list({ noFolder: true, limit: 500 }),
		queryFn: () => dictionaryApi.list({ noFolder: true, limit: 500 }),
		enabled: open,
	});

	const handleClose = () => {
		setSelectedId(null);
		onClose();
	};

	const handleConfirm = () => {
		if (!selectedId || !uncatData) return;
		assign(
			{
				assignments: uncatData.items.map((entry) => ({
					id: entry.id,
					folderId: selectedId,
				})),
			},
			{ onSuccess: handleClose },
		);
	};

	const handleFolderSelectClick: NonNullable<
		ComponentProps<"button">["onClick"]
	> = (event) => {
		const folderId = event.currentTarget.dataset.folderId;
		if (!folderId) return;
		setSelectedId(folderId);
	};

	return {
		t,
		selectedId,
		isPending,
		loadingEntries,
		handleClose,
		handleConfirm,
		handleFolderSelectClick,
	};
};
