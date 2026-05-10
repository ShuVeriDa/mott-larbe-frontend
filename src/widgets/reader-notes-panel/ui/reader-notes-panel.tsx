"use client";

import {
	NoteCard,
	NoteForm,
	useCreateNote,
	useDeleteNote,
	useNotes,
	useUpdateNote,
} from "@/entities/note";
import { cn } from "@/shared/lib/cn";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import {
	READER_MOBILE_SHEET_OVERLAY_CLASSES,
	ReaderMobileSheetHeader,
} from "@/shared/ui/reader-mobile-sheet-header";
import { Typography } from "@/shared/ui/typography";
import { NotebookPen, X } from "lucide-react";
import { type MouseEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface ReaderNotesPanelProps {
	textId: string;
	pageNumber: number;
	open: boolean;
	onClose: () => void;
}

const useEscapeToClose = (open: boolean, onClose: () => void) => {
	useEffect(() => {
		if (!open) return;
		const handle = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handle);
		return () => document.removeEventListener("keydown", handle);
	}, [open, onClose]);
};

const NotesPanelBody = ({
	textId,
	pageNumber,
}: {
	textId: string;
	pageNumber: number;
}) => {
	const { t } = useI18n();
	const { data: notes = [], isLoading } = useNotes(textId, pageNumber);
	const { mutate: createNote } = useCreateNote(textId, pageNumber);
	const { mutate: updateNote } = useUpdateNote(textId, pageNumber);
	const { mutate: deleteNote } = useDeleteNote(textId, pageNumber);

	const handleCreate = (body: string) => {
		createNote({ textId, pageNumber, body });
	};

	const handleUpdate = (id: string, body: string) => {
		updateNote({ id, dto: { body } });
	};

	const handleDelete = (id: string) => {
		deleteNote(id);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3">
			<NoteForm onSubmit={handleCreate} />
			{isLoading && (
				<p className="text-[12px] text-t-4">{t("reader.notes.loading")}</p>
			)}
			{!isLoading && notes.length === 0 && (
				<div className="flex flex-col items-center gap-2 py-6 text-center">
					<NotebookPen className="size-8 text-t-4" strokeWidth={1.2} />
					<p className="text-[13px] text-t-3">{t("reader.notes.empty")}</p>
				</div>
			)}
			<div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
				{notes.map((note) => (
					<NoteCard
						key={note.id}
						note={note}
						onUpdate={(body) => handleUpdate(note.id, body)}
						onDelete={() => handleDelete(note.id)}
					/>
				))}
			</div>
		</div>
	);
};

const NotesChromeHeader = ({ onClose }: { onClose: () => void }) => {
	const { t } = useI18n();
	const handleClose: NonNullable<React.ComponentProps<"button">["onClick"]> = () => onClose();

	return (
		<div className="flex shrink-0 items-center justify-between border-b border-hairline border-bd-1 px-3.5 py-2.5">
			<Typography
				tag="span"
				className="text-[11px] font-semibold uppercase tracking-[0.6px] text-t-3"
			>
				{t("reader.notes.title")}
			</Typography>
			<Button
				onClick={handleClose}
				aria-label={t("reader.panel.close")}
				className="inline-flex size-6 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
			>
				<X className="size-3" strokeWidth={1.6} />
			</Button>
		</div>
	);
};

export const ReaderNotesAside = ({
	textId,
	pageNumber,
	open,
	onClose,
}: ReaderNotesPanelProps) => {
	useEscapeToClose(open, onClose);

	return (
		<aside
			aria-hidden={!open}
			className={cn(
				"flex shrink-0 flex-col overflow-hidden bg-surf max-md:hidden",
				"border-l border-hairline transition-[border-color] duration-200",
				open ? "w-[296px] border-bd-1" : "w-0 min-w-0 border-l-transparent",
			)}
		>
			<NotesChromeHeader onClose={onClose} />
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-3">
				<NotesPanelBody textId={textId} pageNumber={pageNumber} />
			</div>
		</aside>
	);
};

export const ReaderNotesSheet = ({
	textId,
	pageNumber,
	open,
	onClose,
}: ReaderNotesPanelProps) => {
	const { t } = useI18n();
	useEscapeToClose(open, onClose);

	const handleBackdropClick = () => onClose();
	const handleSheetClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

	if (!open || typeof window === "undefined") return null;

	return createPortal(
		<div
			role="presentation"
			className={READER_MOBILE_SHEET_OVERLAY_CLASSES}
			onClick={handleBackdropClick}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={t("reader.notes.title")}
				className="flex max-h-[82vh] min-h-0 w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
				onClick={handleSheetClick}
			>
				<ReaderMobileSheetHeader
					title={t("reader.notes.title")}
					closeAriaLabel={t("reader.panel.close")}
					onClose={onClose}
				/>
				<div className="min-h-0 flex-1 overflow-y-auto p-4">
					<NotesPanelBody textId={textId} pageNumber={pageNumber} />
				</div>
			</div>
		</div>,
		document.body,
	);
};
