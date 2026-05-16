"use client";

import type { AnnotatedFormOnPage } from "@/features/word-annotation";
import {
	useAnnotatedFormsByPage,
	useDeleteMorphForm,
	useUpdateMorphForm,
} from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { InputLabel } from "@/shared/ui/input";
import type { WordAnnotationClickDetail } from "@/shared/ui/notion-editor";
import { WORD_ANNOTATION_CLICK_EVENT } from "@/shared/ui/notion-editor";
import { Link2, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { WordAnnotationEditorPopup } from "./word-annotation-editor-popup";

export const WORD_ANNOTATIONS_PANEL_EVENT = "admin:toggle-word-annotations-panel";

interface WordAnnotationsPanelProps {
	textId: string;
	pageNumber: number;
}

interface PopupState {
	x: number;
	y: number;
	form: AnnotatedFormOnPage;
}

// ── Edit modal ────────────────────────────────────────────────────────────────

interface EditModalProps {
	form: AnnotatedFormOnPage;
	textId: string;
	pageNumber: number;
	onClose: () => void;
}

const EditModal = ({ form, textId, pageNumber, onClose }: EditModalProps) => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();
	const { mutate: update, isPending } = useUpdateMorphForm(textId, pageNumber);
	const [translation, setTranslation] = useState(form.translation ?? "");

	const handleTranslationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTranslation(e.currentTarget.value);
	};

	const handleSave = () => {
		update(
			{ id: form.morphFormId, translation: translation.trim() || undefined },
			{
				onSuccess: () => {
					success(t("admin.texts.editPage.wordAnnotation.updateSuccess"));
					onClose();
				},
				onError: () => toastError(t("admin.texts.editPage.wordAnnotation.error")),
			},
		);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") handleSave();
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
						<Link2 className="size-4 text-acc" strokeWidth={1.6} />
						<span className="text-[13px] font-semibold text-t-1">
							{t("admin.texts.editPage.wordAnnotation.editTitle")}
						</span>
					</div>
					<button
						onClick={onClose}
						className="rounded-md p-1 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<X className="size-4" />
					</button>
				</div>

				<div className="space-y-3 p-4">
					<div>
						<InputLabel>{t("admin.texts.editPage.wordAnnotation.wordFormLabel")}</InputLabel>
						<div className="rounded-base border-hairline border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 select-none">
							{form.normalized}
						</div>
					</div>
					<div>
						<InputLabel>{t("admin.texts.editPage.wordAnnotation.lemmaLabel")}</InputLabel>
						<div className="rounded-base border-hairline border-bd-2 bg-surf-2 px-[10px] py-[7px] text-[13px] text-t-2 select-none">
							{form.lemmaBaseForm}
						</div>
					</div>
					<div>
						<InputLabel htmlFor="edit-annotation-translation">
							{t("admin.texts.editPage.wordAnnotation.formTranslationPlaceholder")}
						</InputLabel>
						<Input
							id="edit-annotation-translation"
							value={translation}
							onChange={handleTranslationChange}
							onKeyDown={handleKeyDown}
							placeholder={t("admin.texts.editPage.wordAnnotation.formTranslationPlaceholder")}
							autoFocus
						/>
					</div>
					<div className="flex gap-2 pt-1">
						<Button
							onClick={handleSave}
							disabled={isPending}
							className="h-[34px] flex-1 rounded-lg bg-acc text-[13px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-50"
						>
							{isPending ? "…" : t("admin.texts.editPage.wordAnnotation.save")}
						</Button>
						<Button
							onClick={onClose}
							className="h-[34px] rounded-lg border-hairline border-bd-1 bg-surf-2 px-4 text-[13px] font-medium text-t-2 transition-colors hover:bg-surf-3"
						>
							{t("reader.annotate.cancel")}
						</Button>
					</div>
				</div>
			</div>
		</>,
		document.body,
	);
};

// ── List item ─────────────────────────────────────────────────────────────────

interface AnnotationItemProps {
	form: AnnotatedFormOnPage;
	onEdit: (form: AnnotatedFormOnPage) => void;
	onDelete: (form: AnnotatedFormOnPage) => void;
	isDeleting: boolean;
}

const AnnotationItem = ({ form, onEdit, onDelete, isDeleting }: AnnotationItemProps) => {
	const { t } = useI18n();
	const [confirmDelete, setConfirmDelete] = useState(false);

	const handleEdit = () => onEdit(form);
	const handleDeleteRequest = () => setConfirmDelete(true);
	const handleDeleteConfirm = () => { onDelete(form); setConfirmDelete(false); };

	return (
		<div className="group relative rounded-lg border-hairline border-bd-1 bg-surf-2 p-3 transition-colors hover:border-bd-2">
			<div className="mb-1 flex items-start justify-between gap-2">
				<div className="min-w-0">
					<span className="text-[13px] font-semibold text-t-1">{form.normalized}</span>
					<span className="ml-1.5 text-[11px] text-t-3">→ {form.lemmaBaseForm}</span>
				</div>
				<div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
					<button
						onClick={handleEdit}
						className="rounded p-1 text-t-3 transition-colors hover:bg-surf-3 hover:text-t-1"
					>
						<Pencil className="size-3" />
					</button>
					{!confirmDelete ? (
						<button
							onClick={handleDeleteRequest}
							className="rounded p-1 text-t-3 transition-colors hover:bg-red/10 hover:text-red"
						>
							<Trash2 className="size-3" />
						</button>
					) : (
						<button
							onClick={handleDeleteConfirm}
							disabled={isDeleting}
							className="rounded px-1.5 py-0.5 text-[10px] font-semibold text-red transition-colors hover:bg-red/10 disabled:opacity-60"
						>
							{isDeleting ? "…" : t("admin.texts.editPage.phraseDeleteConfirm")}
						</button>
					)}
				</div>
			</div>
			{form.translation && (
				<div className="text-[12px] text-t-2">{form.translation}</div>
			)}
		</div>
	);
};

// ── Main panel ────────────────────────────────────────────────────────────────

export const WordAnnotationsPanel = ({ textId, pageNumber }: WordAnnotationsPanelProps) => {
	const { t } = useI18n();
	const { success, error: toastError } = useToast();
	const [isOpen, setIsOpen] = useState(false);
	const [editingForm, setEditingForm] = useState<AnnotatedFormOnPage | null>(null);
	const [popup, setPopup] = useState<PopupState | null>(null);

	const { data: forms = [], isLoading } = useAnnotatedFormsByPage(textId, pageNumber);
	const { mutate: deleteForm, isPending: isDeleting } = useDeleteMorphForm(textId, pageNumber);

	const handleDelete = (form: AnnotatedFormOnPage) => {
		deleteForm(form.morphFormId, {
			onSuccess: () => {
				success(t("admin.texts.editPage.wordAnnotation.deleteSuccess"));
				setPopup(null);
			},
			onError: () => toastError(t("admin.texts.editPage.wordAnnotation.error")),
		});
	};

	useEffect(() => {
		const handleToggle = () => setIsOpen(v => !v);
		document.addEventListener(WORD_ANNOTATIONS_PANEL_EVENT, handleToggle);
		return () => document.removeEventListener(WORD_ANNOTATIONS_PANEL_EVENT, handleToggle);
	}, []);

	useEffect(() => {
		const handle = (e: Event) => {
			const { normalized, x, y } = (e as CustomEvent<WordAnnotationClickDetail>).detail;
			const found = forms.find(f => f.normalized === normalized);
			if (found) setPopup({ x, y, form: found });
		};
		document.addEventListener(WORD_ANNOTATION_CLICK_EVENT, handle);
		return () => document.removeEventListener(WORD_ANNOTATION_CLICK_EVENT, handle);
	}, [forms]);

	const handlePopupEdit = () => {
		if (!popup) return;
		setEditingForm(popup.form);
		setPopup(null);
	};

	const handlePopupDelete = () => {
		if (!popup) return;
		handleDelete(popup.form);
	};

	const handleClosePanel = () => setIsOpen(false);

	if (typeof window === "undefined") return null;

	return createPortal(
		<>
			{isOpen && (
				<div
					className="fixed inset-0 z-199 bg-black/20"
					onClick={handleClosePanel}
					aria-hidden="true"
				/>
			)}

			<div
				className={`fixed top-0 right-0 z-200 flex h-full w-[320px] flex-col border-l border-hairline border-bd-2 bg-surf shadow-xl transition-transform duration-250 ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between border-b border-hairline border-bd-1 px-4 py-3">
					<div className="flex items-center gap-2">
						<Link2 className="size-4 text-acc" strokeWidth={1.6} />
						<span className="text-[13.5px] font-semibold text-t-1">
							{t("admin.texts.editPage.wordAnnotation.panelTitle")}
						</span>
						{forms.length > 0 && (
							<span className="rounded-full bg-surf-3 px-1.5 py-0.5 text-[10px] font-semibold text-t-2">
								{forms.length}
							</span>
						)}
					</div>
					<button
						onClick={handleClosePanel}
						className="rounded-md p-1 text-t-3 transition-colors hover:bg-surf-2 hover:text-t-1"
					>
						<X className="size-4" />
					</button>
				</div>

				<div className="flex-1 overflow-y-auto p-3">
					{isLoading ? (
						<div className="flex items-center justify-center py-8">
							<div className="size-4 animate-spin rounded-full border-2 border-surf-3 border-t-acc" />
						</div>
					) : forms.length === 0 ? (
						<div className="py-8 text-center text-[12px] text-t-3">
							{t("admin.texts.editPage.wordAnnotation.panelEmpty")}
						</div>
					) : (
						<div className="flex flex-col gap-2">
							{forms.map(form => (
								<AnnotationItem
									key={form.morphFormId}
									form={form}
									onEdit={setEditingForm}
									onDelete={handleDelete}
									isDeleting={isDeleting}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{popup && (
				<WordAnnotationEditorPopup
					x={popup.x}
					y={popup.y}
					normalized={popup.form.normalized}
					lemmaBaseForm={popup.form.lemmaBaseForm}
					onEdit={handlePopupEdit}
					onDelete={handlePopupDelete}
					onDismiss={() => setPopup(null)}
				/>
			)}

			{editingForm && (
				<EditModal
					form={editingForm}
					textId={textId}
					pageNumber={pageNumber}
					onClose={() => setEditingForm(null)}
				/>
			)}
		</>,
		document.body,
	);
};
