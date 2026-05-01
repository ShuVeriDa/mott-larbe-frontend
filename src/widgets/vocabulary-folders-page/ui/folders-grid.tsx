"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/shared/lib/i18n";
import { formatRelativeFromNow } from "@/shared/lib/format-relative-time";
import { FolderCard, useFolders, type Folder } from "@/entities/folder";
import { FolderCardActions } from "./folder-card-actions";
import { FolderNewCard } from "./folder-new-card";

export interface FoldersGridProps {
	onCreate: () => void;
	onEdit: (folder: Folder) => void;
	onDelete: (folder: Folder) => void;
	createDisabled?: boolean;
}

export const FoldersGrid = ({
	onCreate,
	onEdit,
	onDelete,
	createDisabled,
}: FoldersGridProps) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { data: folders, isLoading, isError } = useFolders();
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	const cardLabels = {
		new: t("vocabulary.foldersPage.card.new"),
		learning: t("vocabulary.foldersPage.card.learning"),
		known: t("vocabulary.foldersPage.card.known"),
		progress: t("vocabulary.foldersPage.card.progress"),
		open: t("vocabulary.foldersPage.card.open"),
		noWords: t("vocabulary.foldersPage.card.noWords"),
		updated: (date: string | null) => {
			if (!date) return t("vocabulary.foldersPage.card.never");
			const relative = formatRelativeFromNow(date, t);
			return t("vocabulary.foldersPage.card.updatedAgo", { time: relative });
		},
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className="h-[230px] animate-pulse rounded-card border-hairline border-bd-1 bg-surf"
					/>
				))}
			</div>
		);
	}

	if (isError) {
		return (
			<div className="rounded-card border-hairline border-bd-1 bg-surf px-5 py-6 text-[13px] text-t-3">
				{t("vocabulary.errorLoading")}
			</div>
		);
	}

	const list = folders ?? [];

	if (list.length === 0) {
		return (
			<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
				<FolderNewCard onClick={onCreate} disabled={createDisabled} />
				<div className="col-span-full rounded-card border-hairline border-bd-1 bg-surf px-5 py-8 text-center sm:col-span-1 lg:col-span-2">
					<div className="mb-1 text-[14px] font-semibold text-t-1">
						{t("vocabulary.foldersPage.empty.title")}
					</div>
					<div className="text-[12.5px] text-t-3">
						{t("vocabulary.foldersPage.empty.description")}
					</div>
				</div>
			</div>
		);
	}

	const open = (folder: Folder) =>
		router.push(`/${lang}/vocabulary?folderId=${folder.id}`);

	return (
		<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
			{list.map((folder) => (
				<div key={folder.id} className="relative">
					<FolderCard
						folder={folder}
						labels={cardLabels}
						onOpen={() => open(folder)}
						onMenu={() =>
							setOpenMenuId((cur) => (cur === folder.id ? null : folder.id))
						}
						menuLabel={t("vocabulary.foldersPage.card.menu")}
						menuSlot={
							<FolderCardActions
								open={openMenuId === folder.id}
								onClose={() => setOpenMenuId(null)}
								onRename={() => onEdit(folder)}
								onRecolor={() => onEdit(folder)}
								onOpen={() => open(folder)}
								onDelete={() => onDelete(folder)}
								labels={{
									rename: t("vocabulary.foldersPage.card.menuRename"),
									recolor: t("vocabulary.foldersPage.card.menuRecolor"),
									open: t("vocabulary.foldersPage.card.menuOpen"),
									delete: t("vocabulary.foldersPage.card.menuDelete"),
								}}
							/>
						}
					/>
				</div>
			))}
			<FolderNewCard onClick={onCreate} disabled={createDisabled} />
		</div>
	);
};
