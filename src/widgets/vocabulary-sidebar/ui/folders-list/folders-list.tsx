"use client";

import { Plus } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { FolderItem, useFolders } from "@/entities/folder";
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
				onClick={onCreateFolder}
				className="mt-[3px] flex w-full items-center gap-[5px] rounded-[7px] border border-dashed border-bd-2 bg-transparent px-2 py-[5px] font-[inherit] text-xs text-t-3 transition-colors duration-150 hover:border-acc hover:text-acc"
			>
				<Plus className="size-[11px]" strokeWidth={2} />
				{t("vocabulary.newFolder")}
			</button>
		</div>
	);
};
