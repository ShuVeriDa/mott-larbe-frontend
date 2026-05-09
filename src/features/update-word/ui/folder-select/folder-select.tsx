"use client";

import { Select } from "@/shared/ui/select";
import { useI18n } from "@/shared/lib/i18n";
import { useFolders } from "@/entities/folder";
import { useUsage } from "@/entities/subscription";
import { useUpdateWord } from "../../model";

export interface FolderSelectProps {
	wordId: string;
	currentFolderId: string | null;
}

export const FolderSelect = ({ wordId, currentFolderId }: FolderSelectProps) => {
	const { t } = useI18n();
	const { data: folders } = useFolders();
	const { data: usage } = useUsage();
	const { mutate, isPending } = useUpdateWord();
	const hasFolders = usage?.limits.dictionaryFolders ?? true;

		const handleClick: NonNullable<React.ComponentProps<typeof Select>["onClick"]> = (e) => e.stopPropagation();
	const handleChange: NonNullable<React.ComponentProps<typeof Select>["onChange"]> = (e) => {
				const value = e.target.value;
				mutate({
					id: wordId,
					body: { folderId: value === "" ? null : value },
				});
			};
return (
		<Select
			value={currentFolderId ?? ""}
			disabled={isPending || !hasFolders}
			onClick={handleClick}
			onChange={handleChange}
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
