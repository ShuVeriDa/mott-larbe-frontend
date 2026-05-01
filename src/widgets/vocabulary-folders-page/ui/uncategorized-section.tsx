"use client";

import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { useDictionaryList, type DictionaryEntry } from "@/entities/dictionary";
import { useFolders, type Folder } from "@/entities/folder";
import {
	FolderPickerPopover,
	useAssignEntriesToFolder,
} from "@/features/assign-folder";

export interface UncategorizedSectionProps {
	count: number;
}

const Chip = ({
	entry,
	folders,
	onAssign,
	assignLabel,
}: {
	entry: DictionaryEntry;
	folders: Folder[];
	onAssign: (entryId: string, folderId: string) => void;
	assignLabel: string;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative">
			<div
				className={cn(
					"flex items-center gap-1.5 rounded-base border-hairline border-bd-1 bg-surf-2 px-2.5 py-[5px]",
					"transition-colors hover:border-bd-2",
				)}
			>
				<span className="font-display text-[13px] italic text-t-1">
					{entry.word}
				</span>
				<span className="text-[11.5px] text-t-3">{entry.translation}</span>
				<button
					type="button"
					aria-label={assignLabel}
					onClick={() => setOpen((v) => !v)}
					className={cn(
						"ml-0.5 flex size-[18px] items-center justify-center rounded-[4px]",
						"bg-acc-bg text-acc transition-colors hover:bg-acc hover:text-white",
					)}
				>
					<Plus className="size-[9px]" strokeWidth={2.5} />
				</button>
			</div>
			<FolderPickerPopover
				open={open}
				onClose={() => setOpen(false)}
				folders={folders}
				onPick={(folderId) => {
					onAssign(entry.id, folderId);
					setOpen(false);
				}}
				className="left-0 top-[calc(100%+4px)]"
			/>
		</div>
	);
};

const UncategorizedChips = ({
	folders,
	onAssign,
}: {
	folders: Folder[];
	onAssign: (entryId: string, folderId: string) => void;
}) => {
	const { t } = useI18n();
	const { data, isLoading, isError } = useDictionaryList({
		noFolder: true,
		limit: 100,
	});

	if (isLoading) {
		return (
			<div className="flex flex-wrap gap-1.5">
				{Array.from({ length: 6 }).map((_, i) => (
					<div
						key={i}
						className="h-7 w-24 animate-pulse rounded-base bg-surf-2"
					/>
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="text-[12.5px] text-t-3">
				{t("vocabulary.foldersPage.uncategorized.loadFailed")}
			</div>
		);
	}

	const items = data?.items ?? [];

	if (items.length === 0) {
		return (
			<div className="text-[12.5px] text-t-3">
				{t("vocabulary.foldersPage.uncategorized.empty")}
			</div>
		);
	}

	return (
		<div className="flex flex-wrap gap-1.5">
			{items.map((entry) => (
				<Chip
					key={entry.id}
					entry={entry}
					folders={folders}
					onAssign={onAssign}
					assignLabel={t("vocabulary.foldersPage.uncategorized.assignTo", {
						word: entry.word,
					})}
				/>
			))}
		</div>
	);
};

export const UncategorizedSection = ({ count }: UncategorizedSectionProps) => {
	const { t } = useI18n();
	const [open, setOpen] = useState(false);
	const { data: folders } = useFolders();
	const { mutate: assign, isPending } = useAssignEntriesToFolder();

	if (count === 0) return null;

	const handleAssign = (entryId: string, folderId: string) =>
		assign({ assignments: [{ id: entryId, folderId }] });

	return (
		<div className="overflow-hidden rounded-card border-hairline border-bd-1 bg-surf">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				disabled={isPending}
				className={cn(
					"flex w-full items-center gap-2.5 border-hairline border-b border-bd-1 px-[18px] py-3.5",
					"text-left transition-colors hover:bg-surf-2",
					isPending && "opacity-60",
				)}
			>
				<ChevronRight
					className={cn(
						"size-3 text-t-4 transition-transform duration-200",
						open && "rotate-90",
					)}
					strokeWidth={1.6}
				/>
				<span className="flex-1 text-[13px] font-semibold text-t-2">
					{t("vocabulary.foldersPage.uncategorized.title")}
				</span>
				<span className="text-[12px] text-t-3">
					{t("vocabulary.foldersPage.uncategorized.count", { count })}
				</span>
			</button>

			{open ? (
				<div className="px-[18px] py-3">
					<UncategorizedChips
						folders={folders ?? []}
						onAssign={handleAssign}
					/>
				</div>
			) : null}
		</div>
	);
};
