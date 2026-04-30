"use client";

import { Select } from "@/shared/ui/select";
import { useI18n } from "@/shared/lib/i18n";
import { useFolders } from "@/entities/folder";
import { useUpdateWord } from "../../model";

export interface FolderSelectProps {
	wordId: string;
	currentFolderId: string | null;
}

export const FolderSelect = ({ wordId, currentFolderId }: FolderSelectProps) => {
	const { t } = useI18n();
	const { data: folders } = useFolders();
	const { mutate, isPending } = useUpdateWord();

	return (
		<Select
			value={currentFolderId ?? ""}
			disabled={isPending}
			onClick={(e) => e.stopPropagation()}
			onChange={(e) => {
				const value = e.target.value;
				mutate({
					id: wordId,
					body: { folderId: value === "" ? null : value },
				});
			}}
			aria-label={t("vocabulary.card.folder")}
		>
			<option value="">{t("vocabulary.card.noFolder")}</option>
			{folders?.map((f) => (
				<option key={f.id} value={f.id}>
					{f.name}
				</option>
			))}
		</Select>
	);
};
