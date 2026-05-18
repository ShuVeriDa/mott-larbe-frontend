"use client";

import {
	useAdminPagePhrases,
	useDeletePhraseOccurrence,
	useUpdatePhrase,
	type PagePhraseOccurrence,
} from "@/entities/admin-text-phrase";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Input, InputLabel } from "@/shared/ui/input";
import {
	PHRASE_CLICK_EVENT,
	type PhraseClickDetail,
} from "@/shared/ui/notion-editor";
import { Languages, Pencil, Trash2, X } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import { type ComponentProps, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PhraseEditorPopup } from "./phrase-editor-popup";

export const PHRASES_PANEL_EVENT = "admin:toggle-phrases-panel";
export const PHRASE_DELETE_EVENT = "admin:phrase-delete";
export const PHRASE_EDIT_EVENT = "admin:phrase-edit";

interface PhrasesListPanelProps {
	textId: string;
	pageNumber: number;
}

// ── Edit modal ────────────────────────────────────────────────────────────────

interface EditModalProps {
	occurrence: PagePhraseOccurrence;
	textId: string;
	pageNumber: number;
	onClose: () => void;
}

const EditModal = ({
	occurrence,
	textId,
	pageNumber,
	onClose,
}: EditModalProps) => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();
	const { mutate: update, isPending } = useUpdatePhrase(textId, pageNumber);
	const [translation, setTranslation] = useState(occurrence.phrase.translation);
	const [notes, setNotes] = useState(occurrence.phrase.notes ?? "");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		document.dispatchEvent(new Event("admin:open-phrase-form"));
		const timer = setTimeout(() => inputRef.current?.focus(), 50);
		return () => {
			clearTimeout(timer);
			document.dispatchEvent(new Event("admin:close-phrase-form"));
		};
	}, []);

	const handleTranslationChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setTranslation(e.currentTarget.value);
	const handleNotesChange: NonNullable<ComponentProps<"input">["onChange"]> = e => setNotes(e.currentTarget.value);
	const handleTranslationKeyDown: NonNullable<ComponentProps<"input">["onKeyDown"]> = e => {
		if (e.key === "Enter") handleSave();
	};

	const handleSave = () => {
		if (!translation.trim()) return;
		update(
			{
				phraseId: occurrence.phrase.id,
				dto: {
					translation: translation.trim(),
					notes: notes.trim() || undefined,
				},
			},
			{
				onSuccess: () => {
					success(t("admin.texts.editPage.phraseUpdated"));
					onClose();
				},
				onError: () => toastError(t("admin.texts.editPage.phraseUpdateFailed")),
			},
		);
	};

	return createPortal(
		<>
			<div
				className="fixed inset-0 z-299 bg-black/30 backdrop-blur-[2px]"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div
				role="dialog"
				aria-modal="true"
				className="fixed left-1/2 top-1/2 z-300 w-[340px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border-hairline border-bd-2 bg-surf shadow-xl"
			>
				<div className="flex items-center justify-between border-b border-hairline border-bd-1 px-4 py-3">
					<div className="flex items-center gap-2">
						<Languages className="size-4 text-violet-500" strokeWidth={1.6} />
						<Typography tag="span" className="text-[13px] font-semibold text-t-1">
							{t("admin.texts.editPage.phraseEditTitle")}
						</Typography>
					</div>
					<Button
						onClick={onClose}
						title={t("reader.panel.close")}
						className="rounded-md p-1 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<X className="size-4" />
					</Button>
				</div>

				<div className="space-y-3 p-4">
					<div>
						<InputLabel>{t("admin.texts.editPage.phraseOriginal")}</InputLabel>
						<div className="rounded-base border-hairline border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 opacity-70 select-none">
							{occurrence.phrase.original}
						</div>
					</div>

					<div>
						<InputLabel htmlFor="edit-phrase-translation">
							{t("admin.texts.editPage.phraseTranslation")}
						</InputLabel>
						<Input
							id="edit-phrase-translation"
							ref={inputRef}
							value={translation}
							onChange={handleTranslationChange}
							onKeyDown={handleTranslationKeyDown}
							placeholder={t(
								"admin.texts.editPage.phraseTranslationPlaceholder",
							)}
							aria-label={t("admin.texts.editPage.phraseTranslation")}
							className="h-[34px] rounded-base bg-surf-2 px-[10px] text-[13px]"
						/>
					</div>

					<div>
						<InputLabel htmlFor="edit-phrase-notes">
							{t("admin.texts.editPage.phraseNotes")}
						</InputLabel>
						<Input
							id="edit-phrase-notes"
							value={notes}
							onChange={handleNotesChange}
							placeholder={t("admin.texts.editPage.phraseNotesPlaceholder")}
							aria-label={t("admin.texts.editPage.phraseNotes")}
							className="h-[34px] rounded-base bg-surf-2 px-[10px] text-[13px]"
						/>
					</div>

					<div className="flex gap-2 pt-1">
						<Button
							onClick={handleSave}
							disabled={!translation.trim() || isPending}
							className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isPending ? "…" : t("admin.texts.editPage.phraseUpdate")}
						</Button>
						<Button
							onClick={onClose}
							className="h-[34px] rounded-lg border-hairline border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
						>
							{t("admin.texts.editPage.phraseCancel")}
						</Button>
					</div>
				</div>
			</div>
		</>,
		document.body,
	);
};

// ── Phrase list item ──────────────────────────────────────────────────────────

interface PhraseItemProps {
	occurrence: PagePhraseOccurrence;
	onEdit: (occ: PagePhraseOccurrence) => void;
	onDelete: (occurrenceId: string) => void;
	isDeleting: boolean;
}

const PhraseItem = ({
	occurrence,
	onEdit,
	onDelete,
	isDeleting,
}: PhraseItemProps) => {
	const { t } = useI18n();
	const [confirmDelete, setConfirmDelete] = useState(false);

	return (
		<div className="group relative rounded-lg border-hairline border-bd-1 bg-surf-2 p-3 transition-colors hover:border-bd-2">
			<div className="mb-1 flex items-start justify-between gap-2">
				<div className="text-[13px] font-semibold text-t-1 leading-tight">
					{occurrence.phrase.original}
				</div>
				<div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
					<Button
						onClick={() => onEdit(occurrence)}
						title={t("admin.texts.editPage.phraseEditTitle")}
						className="rounded p-1 text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<Pencil className="size-3" />
					</Button>
					{!confirmDelete ? (
						<Button
							onClick={() => setConfirmDelete(true)}
							title={t("admin.texts.editPage.phraseDeleteConfirm")}
							className="rounded p-1 text-t-3 transition-colors hover:bg-red/10 hover:text-red"
						>
							<Trash2 className="size-3" />
						</Button>
					) : (
						<Button
							onClick={() => {
								onDelete(occurrence.id);
								setConfirmDelete(false);
							}}
							title={t("admin.texts.editPage.phraseDeleteConfirm")}
							disabled={isDeleting}
							className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-red transition-colors hover:bg-red/10 disabled:opacity-60"
						>
							{isDeleting ? "…" : t("admin.texts.editPage.phraseDeleteConfirm")}
						</Button>
					)}
				</div>
			</div>
			<div className="text-[12px] text-t-2">
				{occurrence.phrase.translation}
			</div>
			{occurrence.phrase.notes && (
				<div className="mt-1 text-[11px] text-t-3">
					{occurrence.phrase.notes}
				</div>
			)}
		</div>
	);
};

// ── Popup state ───────────────────────────────────────────────────────────────

interface PopupState {
	x: number;
	y: number;
	occurrence: PagePhraseOccurrence;
}

// ── Main panel ────────────────────────────────────────────────────────────────

export const PhrasesListPanel = ({
	textId,
	pageNumber,
}: PhrasesListPanelProps) => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [editingOccurrence, setEditingOccurrence] =
		useState<PagePhraseOccurrence | null>(null);
	const [popup, setPopup] = useState<PopupState | null>(null);

	const { data: phrases = [], isLoading } = useAdminPagePhrases(
		textId,
		pageNumber,
	);
	const { mutate: deleteOccurrence, isPending: isDeleting } =
		useDeletePhraseOccurrence(textId, pageNumber);

	const handleDelete = (occurrenceId: string) => {
		deleteOccurrence(occurrenceId, {
			onSuccess: () => {
				success(t("admin.texts.editPage.phraseDeleted"));
				setPopup(null);
			},
			onError: () => toastError(t("admin.texts.editPage.phraseDeleteFailed")),
		});
	};

	useEffect(() => {
		const handleToggle = () => setIsOpen(v => !v);
		document.addEventListener(PHRASES_PANEL_EVENT, handleToggle);
		return () =>
			document.removeEventListener(PHRASES_PANEL_EVENT, handleToggle);
	}, []);

	const findOccurrence = (phraseText: string) =>
		phrases.find(
			p => p.phrase.original.toLowerCase() === phraseText.toLowerCase(),
		);

	// Click on phrase highlight in editor → open edit modal
	useEffect(() => {
		const handle = (e: Event) => {
			const { phraseText, x, y } = (e as CustomEvent<PhraseClickDetail>).detail;
			const occ = findOccurrence(phraseText);
			if (occ) setPopup({ x, y, occurrence: occ });
		};
		document.addEventListener(PHRASE_CLICK_EVENT, handle);
		return () => document.removeEventListener(PHRASE_CLICK_EVENT, handle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phrases]);

	// Direct delete from bubble menu
	useEffect(() => {
		const handle = (e: Event) => {
			const phraseText = (e as CustomEvent<string>).detail;
			const occ = findOccurrence(phraseText);
			if (occ) handleDelete(occ.id);
		};
		document.addEventListener(PHRASE_DELETE_EVENT, handle);
		return () => document.removeEventListener(PHRASE_DELETE_EVENT, handle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phrases]);

	// Direct edit from bubble menu → skip intermediate popup, open EditModal
	useEffect(() => {
		const handle = (e: Event) => {
			const phraseText = (e as CustomEvent<string>).detail;
			const occ = findOccurrence(phraseText);
			if (occ) setEditingOccurrence(occ);
		};
		document.addEventListener(PHRASE_EDIT_EVENT, handle);
		return () => document.removeEventListener(PHRASE_EDIT_EVENT, handle);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [phrases]);

	const handlePopupEdit = () => {
		if (!popup) return;
		setEditingOccurrence(popup.occurrence);
		setPopup(null);
	};

	const handlePopupDelete = () => {
		if (!popup) return;
		handleDelete(popup.occurrence.id);
	};

	if (typeof window === "undefined") return null;

	return createPortal(
		<>
			{/* Backdrop for side panel */}
			{isOpen && (
				<div
					className="fixed inset-0 z-199 bg-black/20"
					onClick={() => setIsOpen(false)}
					aria-hidden="true"
				/>
			)}

			{/* Slide-in panel */}
			<div
				className={`fixed top-0 right-0 z-200 flex h-full w-[320px] flex-col border-l border-hairline border-bd-2 bg-surf shadow-xl transition-transform duration-250 ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between border-b border-hairline border-bd-1 px-4 py-3">
					<div className="flex items-center gap-2">
						<Languages className="size-4 text-violet-500" strokeWidth={1.6} />
						<Typography tag="span" className="text-[13.5px] font-semibold text-t-1">
							{t("admin.texts.editPage.phraseListTitle")}
						</Typography>
						{phrases.length > 0 && (
							<Typography tag="span" className="rounded-full bg-surf-3 px-1.5 py-0.5 text-[10px] font-semibold text-t-2">
								{phrases.length}
							</Typography>
						)}
					</div>
					<Button
						onClick={() => setIsOpen(false)}
						title={t("reader.panel.close")}
						className="rounded-md p-1 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<X className="size-4" />
					</Button>
				</div>

				<div className="flex-1 overflow-y-auto p-3">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="size-4 animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
						</div>
					) : phrases.length === 0 ? (
						<div className="py-8 text-center text-[12px] text-t-3">
							{t("admin.texts.editPage.phraseListEmpty")}
						</div>
					) : (
						<div className="flex flex-col gap-2">
							{phrases.map(occ => (
								<PhraseItem
									key={occ.id}
									occurrence={occ}
									onEdit={setEditingOccurrence}
									onDelete={handleDelete}
									isDeleting={isDeleting}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Floating popup on phrase click / selection */}
			{popup && (
				<PhraseEditorPopup
					x={popup.x}
					y={popup.y}
					phraseText={popup.occurrence.phrase.original}
					onEdit={handlePopupEdit}
					onDelete={handlePopupDelete}
					onDismiss={() => setPopup(null)}
				/>
			)}

			{/* Edit modal */}
			{editingOccurrence && (
				<EditModal
					occurrence={editingOccurrence}
					textId={textId}
					pageNumber={pageNumber}
					onClose={() => setEditingOccurrence(null)}
				/>
			)}
		</>,
		document.body,
	);
};
