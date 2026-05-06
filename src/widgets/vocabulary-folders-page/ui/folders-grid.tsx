"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	rectSortingStrategy,
	sortableKeyboardCoordinates,
	useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useI18n } from "@/shared/lib/i18n";
import { cn } from "@/shared/lib/cn";
import { formatRelativeFromNow } from "@/shared/lib/format-relative-time";
import { FolderCard, useFolders, type Folder } from "@/entities/folder";
import { useReorderFolders } from "@/features/update-folder";
import { FolderCardActions } from "./folder-card-actions";
import { FolderNewCard } from "./folder-new-card";

export interface FoldersGridProps {
	onCreate: () => void;
	onEdit: (folder: Folder) => void;
	onDelete: (folder: Folder) => void;
	createDisabled?: boolean;
	onForbidden?: () => void;
}

interface SortableCardProps {
	folder: Folder;
	cardLabels: {
		new: string;
		learning: string;
		known: string;
		progress: string;
		open: string;
		noWords: string;
		updated: (date: string | null) => string;
	};
	menuLabel: string;
	openMenuId: string | null;
	onOpen: () => void;
	onMenuToggle: () => void;
	onMenuClose: () => void;
	onEdit: () => void;
	onDelete: () => void;
	menuLabels: {
		rename: string;
		recolor: string;
		open: string;
		delete: string;
	};
}

const SortableCard = ({
	folder,
	cardLabels,
	menuLabel,
	openMenuId,
	onOpen,
	onMenuToggle,
	onMenuClose,
	onEdit,
	onDelete,
	menuLabels,
}: SortableCardProps) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: folder.id });

	return (
		<div
			ref={setNodeRef}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
			className={cn(
				"relative cursor-grab touch-none active:cursor-grabbing",
				isDragging && "z-50 opacity-50 shadow-lg",
			)}
			{...attributes}
			{...listeners}
		>
			<FolderCard
				folder={folder}
				labels={cardLabels}
				onOpen={onOpen}
				onMenu={onMenuToggle}
				menuLabel={menuLabel}
				menuSlot={
					<FolderCardActions
						open={openMenuId === folder.id}
						onClose={onMenuClose}
						onRename={onEdit}
						onRecolor={onEdit}
						onOpen={onOpen}
						onDelete={onDelete}
						labels={menuLabels}
					/>
				}
			/>
		</div>
	);
};

export const FoldersGrid = ({
	onCreate,
	onEdit,
	onDelete,
	createDisabled,
	onForbidden,
}: FoldersGridProps) => {
	const { t, lang } = useI18n();
	const router = useRouter();
	const { data: folders, isLoading, isError, error } = useFolders();
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const { mutate: reorder } = useReorderFolders();

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

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

	const menuLabels = {
		rename: t("vocabulary.foldersPage.card.menuRename"),
		recolor: t("vocabulary.foldersPage.card.menuRecolor"),
		open: t("vocabulary.foldersPage.card.menuOpen"),
		delete: t("vocabulary.foldersPage.card.menuDelete"),
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
		const status = (error as { response?: { status?: number } })?.response
			?.status;
		if (status === 403 && onForbidden) {
			onForbidden();
		}
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

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;

		const oldIndex = list.findIndex((f) => f.id === active.id);
		const newIndex = list.findIndex((f) => f.id === over.id);
		if (oldIndex === -1 || newIndex === -1) return;

		const reordered = [...list];
		const [moved] = reordered.splice(oldIndex, 1);
		reordered.splice(newIndex, 0, moved);

		reorder({ orderedIds: reordered.map((f) => f.id) });
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={list.map((f) => f.id)}
				strategy={rectSortingStrategy}
			>
				<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
					{list.map((folder) => (
						<SortableCard
							key={folder.id}
							folder={folder}
							cardLabels={cardLabels}
							menuLabel={t("vocabulary.foldersPage.card.menu")}
							openMenuId={openMenuId}
							onOpen={() => open(folder)}
							onMenuToggle={() =>
								setOpenMenuId((cur) =>
									cur === folder.id ? null : folder.id,
								)
							}
							onMenuClose={() => setOpenMenuId(null)}
							onEdit={() => onEdit(folder)}
							onDelete={() => onDelete(folder)}
							menuLabels={menuLabels}
						/>
					))}
					<FolderNewCard onClick={onCreate} disabled={createDisabled} />
				</div>
			</SortableContext>
		</DndContext>
	);
};
