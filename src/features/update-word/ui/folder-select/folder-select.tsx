"use client";

import { Select } from "@/shared/ui/select";
import { useFolderSelect } from "../../model";

export interface FolderSelectProps {
	wordId: string;
	currentFolderId: string | null;
}

export const FolderSelect = ({ wordId, currentFolderId }: FolderSelectProps) => {
	const {
		t,
		folders,
		isPending,
		hasFolders,
		handleSelectClick,
		handleSelectChange,
	} = useFolderSelect({ wordId });

	return (
		<Select
			value={currentFolderId ?? ""}
			disabled={isPending || !hasFolders}
			onClick={handleSelectClick}
			onChange={handleSelectChange}
			aria-label={t("vocabulary.card.folder")}
		>
			<option value="">{t("vocabulary.card.noFolder")}</option>
			{hasFolders
				? folders?.map((f) => (
						<option key={f.id} value={f.id}>
							{f.name}
						</option>
					))
				: null}
		</Select>
	);
};
