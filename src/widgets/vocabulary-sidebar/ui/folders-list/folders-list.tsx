"use client";

import { Lock, Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { FolderItem, useFolders } from "@/entities/folder";
import { useUsage } from "@/entities/subscription";
import { useVocabularyFilters } from "@/features/vocabulary-filters";

const AllWordsIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[14px]">
		<rect
			x="2"
			y="4"
			width="12"
			height="9"
			rx="1.5"
			stroke="currentColor"
			strokeWidth="1.3"
		/>
		<path d="M2 7h12" stroke="currentColor" strokeWidth="1.2" />
	</svg>
);

const FolderIcon = () => (
	<svg viewBox="0 0 16 16" fill="none" className="size-[14px]">
		<path
			d="M2 12V5a1 1 0 011-1h3.5L8 6h5a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1z"
			stroke="currentColor"
			strokeWidth="1.3"
		/>
	</svg>
);

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
	const { data: usage } = useUsage();
	const hasFolders = usage?.limits.dictionaryFolders ?? true;
	const folderId = useVocabularyFilters((s) => s.folderId);
	const setFolderId = useVocabularyFilters((s) => s.setFolderId);

	const handleSelect = (id: string | null) => {
		setFolderId(id);
		onSelect?.();
	};

	return (
		<div className="flex flex-col">
			<div className="flex flex-col gap-0.5">
				<FolderItem
					name={t("vocabulary.allWords")}
					count={totalAllWords}
					active={folderId === null}
					icon={<AllWordsIcon />}
					onClick={() => handleSelect(null)}
				/>
				{folders?.map((f) => (
					<FolderItem
						key={f.id}
						name={f.name}
						count={f.total}
						active={folderId === f.id}
						icon={<FolderIcon />}
						onClick={() => handleSelect(f.id)}
					/>
				))}
			</div>
			<button
				type="button"
				disabled={!hasFolders}
				onClick={hasFolders ? onCreateFolder : undefined}
				title={
					!hasFolders ? t("vocabulary.foldersPage.premiumOnly") : undefined
				}
				className={cn(
					"mt-[3px] flex w-full items-center gap-[5px] rounded-base border border-dashed bg-transparent px-2 py-[5px] font-[inherit] text-xs transition-colors duration-150",
					hasFolders
						? "cursor-pointer border-bd-2 text-t-3 hover:border-acc hover:text-acc"
						: "cursor-not-allowed border-bd-1 text-t-4",
				)}
			>
				{hasFolders ? (
					<Plus className="size-[11px]" strokeWidth={2} />
				) : (
					<Lock className="size-[11px]" strokeWidth={2} />
				)}
				{t("vocabulary.newFolder")}
			</button>
		</div>
	);
};
