"use client";

import { useFolders } from "@/entities/folder";
import {
	useAddToVocabulary,
	useAssignFolder,
} from "@/features/add-to-vocabulary";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Check, ChevronDown, FolderOpen, Plus, X } from "lucide-react";
import { useState } from "react";

export interface AddToDictionaryButtonProps {
	tokenId: string;
	word: string;
	translation: string | null;
	inDictionary: boolean;
	dictionaryEntryId: string | null;
	currentFolderId: string | null;
	currentFolderName: string | null;
	className?: string;
}

export const AddToDictionaryButton = ({
	tokenId,
	word,
	translation,
	inDictionary,
	dictionaryEntryId,
	currentFolderId,
	currentFolderName,
	className,
}: AddToDictionaryButtonProps) => {
	const { t } = useI18n();
	const { success, error } = useToast();
	const { mutate: add, isPending: adding } = useAddToVocabulary();
	const { mutate: assign, isPending: assigning } = useAssignFolder();
	const { data: foldersData } = useFolders();
	const [folderOpen, setFolderOpen] = useState(false);

	const isPending = adding || assigning;
	const folders = foldersData ?? [];

	const handleAdd = () => {
		add(
			{ tokenId, word, translation: translation ?? undefined },
			{
				onSuccess: () => success(t("reader.toasts.addedToDict")),
				onError: () => error(t("reader.toasts.dictFailed")),
			},
		);
	};

	const handleToggleFolderMenu = () => setFolderOpen(prev => !prev);

	const handleFolderSelect = (folderId: string | null) => {
		if (!dictionaryEntryId) return;
		setFolderOpen(false);
		assign(
			{ dictionaryEntryId, folderId, tokenId },
			{
				onSuccess: () => success(t("reader.toasts.folderAssigned")),
				onError: () => error(t("reader.toasts.dictFailed")),
			},
		);
	};

	if (!inDictionary) {
		return (
			<Button
				onClick={handleAdd}
				disabled={isPending}
				className={cn(
					"flex h-9 w-full items-center justify-center gap-1.5",
					"rounded-base bg-acc text-[12px] font-semibold text-white",
					"transition-opacity duration-150 disabled:opacity-60 hover:opacity-90",
					className,
				)}
			>
				<Plus className="size-3.5" strokeWidth={1.8} />
				{t("reader.panel.addToDictionary")}
			</Button>
		);
	}

	const handleRemoveFromFolder = () => handleFolderSelect(null);

	return (
		<div className="relative w-full">
			<div
				className={cn(
					"flex h-9 w-full overflow-hidden rounded-base",
					"bg-grn text-[12px] font-semibold text-white",
					className,
				)}
			>
				<div className="flex flex-1 items-center justify-center gap-1.5 px-2">
					<Check className="size-3.5 shrink-0" strokeWidth={1.8} />
					<span className="truncate">
						{currentFolderName
							? currentFolderName
							: t("reader.panel.inDictionary")}
					</span>
				</div>
				<button
					type="button"
					onClick={handleToggleFolderMenu}
					disabled={isPending}
					aria-label={t("reader.panel.chooseFolder")}
					className="flex items-center border-l border-white/20 px-2 transition-opacity hover:opacity-80 disabled:opacity-60"
				>
					{folderOpen ? (
						<X className="size-3.5" strokeWidth={1.8} />
					) : (
						<ChevronDown className="size-3.5" strokeWidth={1.8} />
					)}
				</button>
			</div>

			{folderOpen && (
				<div className="absolute bottom-[calc(100%+4px)] left-0 z-50 w-full overflow-hidden rounded-card border-[0.5px] border-bd-2 bg-surf shadow-lg">
					{currentFolderId !== null && (
						<button
							type="button"
							onClick={handleRemoveFromFolder}
							className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-t-2 transition-colors hover:bg-surf-2"
						>
							<X className="size-3 shrink-0 text-t-3" strokeWidth={1.5} />
							{t("reader.panel.removeFromFolder")}
						</button>
					)}
					{folders.map(folder => {
						const handleClick = () => handleFolderSelect(folder.id);
						return (
						<button
							key={folder.id}
							type="button"
							onClick={handleClick}
							className={cn(
								"flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors hover:bg-surf-2",
								folder.id === currentFolderId
									? "font-semibold text-t-1"
									: "text-t-2",
							)}
						>
							<FolderOpen
								className="size-3 shrink-0 text-t-3"
								strokeWidth={1.5}
							/>
							{folder.name}
							{folder.id === currentFolderId && (
								<Check className="ml-auto size-3 text-grn" strokeWidth={2} />
							)}
						</button>
					);
					})}
					{folders.length === 0 && (
						<div className="px-3 py-2 text-[12px] text-t-3">
							{t("reader.panel.noFolders")}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
