"use client";

import { type ComponentProps } from "react";
import { useFolders } from "@/entities/folder";
import { useUsage } from "@/entities/subscription";
import { useI18n } from "@/shared/lib/i18n";
import { useUpdateWord } from "./use-update-word";

interface UseFolderSelectParams {
	wordId: string;
}

export const useFolderSelect = ({ wordId }: UseFolderSelectParams) => {
	const { t } = useI18n();
	const { data: folders } = useFolders();
	const { data: usage } = useUsage();
	const { mutate, isPending } = useUpdateWord();
	const hasFolders = usage?.limits.dictionaryFolders ?? true;

	const handleSelectClick: NonNullable<ComponentProps<"select">["onClick"]> = (
		event,
	) => event.stopPropagation();

	const handleSelectChange: NonNullable<ComponentProps<"select">["onChange"]> = (
		event,
	) => {
		const value = event.currentTarget.value;
		mutate({
			id: wordId,
			body: { folderId: value === "" ? null : value },
		});
	};

	return {
		t,
		folders,
		isPending,
		hasFolders,
		handleSelectClick,
		handleSelectChange,
	};
};
