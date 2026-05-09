"use client";

import { Typography } from "@/shared/ui/typography";

import { Button } from "@/shared/ui/button";
import { type ReactNode } from "react";
import { cn } from "@/shared/lib/cn";
import { FolderIcon, type Folder } from "@/entities/folder";
import { useFolderPickerPopover } from "../../model";

export interface FolderPickerPopoverProps {
	open: boolean;
	onClose: () => void;
	folders: Folder[];
	onPick: (folderId: string) => void;
	anchor?: ReactNode;
	className?: string;
}

export const FolderPickerPopover = ({
	open,
	onClose,
	folders,
	onPick,
	className,
}: FolderPickerPopoverProps) => {
	const { t, ref, handleFolderPickClick } = useFolderPickerPopover({
		open,
		onClose,
		onPick,
	});

	if (!open) return null;

	return (
		<div
			ref={ref}
			role="menu"
			className={cn(
				"absolute z-40 min-w-[200px] overflow-hidden rounded-card",
				"border-hairline border-bd-2 bg-surf shadow-md",
				className,
			)}
		>
			<div className="border-b border-hairline border-bd-1 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3">
				{t("vocabulary.foldersPage.uncategorized.chooseFolder")}
			</div>
			{folders.length === 0 ? (
				<div className="px-3 py-3 text-[12px] text-t-3">
					{t("vocabulary.foldersPage.uncategorized.noFolders")}
				</div>
			) : (
				<ul className="max-h-[240px] overflow-y-auto py-1">
					{folders.map((f) => {
					  return (
						<li key={f.id}>
							<Button
								data-folder-id={f.id}
								onClick={handleFolderPickClick}
								className={cn(
									"flex w-full items-center gap-2 px-3 py-2",
									"text-left text-[13px] text-t-2",
									"transition-colors hover:bg-surf-2 hover:text-t-1",
								)}
							>
								<Typography tag="span"
									className="flex size-5 shrink-0 items-center justify-center rounded-[5px]"
									style={{
										background: `${f.color ?? "#2254d3"}1F`,
										color: f.color ?? "#2254d3",
									}}
								>
									<FolderIcon icon={f.icon} className="size-3" />
								</Typography>
								<Typography tag="span" className="truncate">{f.name}</Typography>
							</Button>
						</li>
					);
					})}
				</ul>
			)}
		</div>
	);
};
