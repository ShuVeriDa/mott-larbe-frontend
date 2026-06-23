"use client";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { Folder, LayoutList, Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { FolderItem, useFolders } from "@/entities/folder";
import { useUsage } from "@/entities/subscription";
import { useVocabularyFilters } from "@/features/vocabulary-filters";

const AllWordsIcon = () => <LayoutList className="size-[14px]" />;
const FolderIcon = () => <Folder className="size-[14px]" />;

export interface FoldersListProps {
	totalAllWords: number;
	onCreateFolder: () => void;
	onSelect?: () => void;
}

export const FoldersList = ({
	totalAllWords,
	onCreateFolder,
	onSelect,
}: FoldersListProps) => {
	const { t } = useI18n();
	const { data: folders } = useFolders();
	const { data: _usage } = useUsage();
	const hasFolders = true; // all features free — lock removed
	const folderId = useVocabularyFilters((s) => s.folderId);
	const setFolderId = useVocabularyFilters((s) => s.setFolderId);

	const handleSelect = (id: string | null) => {
		setFolderId(id);
		onSelect?.();
	};

		const handleClick: NonNullable<ComponentProps<typeof FolderItem>["onClick"]> = () => handleSelect(null);
return (
		<div className="flex flex-col">
			<div className="flex flex-col gap-0.5">
				<FolderItem
					name={t("vocabulary.allWords")}
					count={totalAllWords}
					active={folderId === null}
					icon={<AllWordsIcon />}
					onClick={handleClick}
				/>
				{folders?.map((f) => {
				  const handleClick: NonNullable<ComponentProps<typeof FolderItem>["onClick"]> = () => handleSelect(f.id);
				  return (
					<FolderItem
						key={f.id}
						name={f.name}
						count={f.total}
						active={folderId === f.id}
						icon={<FolderIcon />}
						onClick={handleClick}
					/>
				);
				})}
			</div>
			<Button
				variant="bare"
				size={null}
				onClick={onCreateFolder}
				className="mt-[3px] flex w-full items-center gap-[5px] rounded-base border border-dashed bg-transparent px-2 py-[5px] font-[inherit] text-xs transition-colors duration-150 cursor-pointer border-bd-2 text-t-3 hover:border-acc hover:text-acc"
			>
				<Plus className="size-[11px]" strokeWidth={2} />
				{t("vocabulary.newFolder")}
			</Button>
		</div>
	);
};
