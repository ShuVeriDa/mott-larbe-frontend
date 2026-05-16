"use client";

import type { AnnotatedFormOnPage } from "@/features/word-annotation";
import {
	BatchDeleteAnnotationDialog,
	EditAnnotationDialog,
	useAnnotatedFormsByPage,
} from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import type { WordAnnotationClickDetail } from "@/shared/ui/notion-editor";
import { WORD_ANNOTATION_CLICK_EVENT } from "@/shared/ui/notion-editor";
import { Link2, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { WordAnnotationEditorPopup } from "./word-annotation-editor-popup";

export const WORD_ANNOTATIONS_PANEL_EVENT = "admin:toggle-word-annotations-panel";
export const WORD_ANNOTATION_DELETE_EVENT = "admin:delete-word-annotation";
export const WORD_ANNOTATION_EDIT_FORM_EVENT = "admin:edit-word-annotation-form";

interface WordAnnotationsPanelProps {
	textId: string;
	pageNumber: number;
}

export interface WordAnnotationDeleteDetail {
	normalized: string;
	tokenId?: string;
}

interface PopupState {
	x: number;
	y: number;
	form: AnnotatedFormOnPage;
	/** tokenId of the clicked occurrence — used when deleting a single token */
	tokenId: string;
	/** Whether the clicked occurrence is already annotated */
	isAnnotated: boolean;
}

// ── List item ─────────────────────────────────────────────────────────────────

interface AnnotationItemProps {
	form: AnnotatedFormOnPage;
	onEdit: (form: AnnotatedFormOnPage) => void;
	onDelete: (form: AnnotatedFormOnPage) => void;
}

const AnnotationItem = ({ form, onEdit, onDelete }: AnnotationItemProps) => {
	const handleEdit = () => onEdit(form);
	const handleDelete = () => onDelete(form);

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
					<button
						onClick={handleDelete}
						className="rounded p-1 text-t-3 transition-colors hover:bg-red/10 hover:text-red"
					>
						<Trash2 className="size-3" />
					</button>
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
	const [isOpen, setIsOpen] = useState(false);
	const [editingForm, setEditingForm] = useState<AnnotatedFormOnPage | null>(null);
	const [batchDeleteTarget, setBatchDeleteTarget] = useState<AnnotatedFormOnPage | null>(null);
	const [deleteInitialTokenId, setDeleteInitialTokenId] = useState<string | undefined>(undefined);
	const [popup, setPopup] = useState<PopupState | null>(null);

	const { data: allForms = [] } = useAnnotatedFormsByPage(textId, pageNumber);
	const forms = allForms.filter(f => f.inPanel);
	const allFormsRef = useRef(allForms);
	allFormsRef.current = allForms;

	const handleOpenDelete = (form: AnnotatedFormOnPage, tokenId?: string) => {
		setPopup(null);
		setDeleteInitialTokenId(tokenId);
		setBatchDeleteTarget(form);
	};

	useEffect(() => {
		const handleToggle = () => setIsOpen(v => !v);

		const handleClick = (e: Event) => {
			const { normalized, tokenId, isAnnotated, x, y } = (e as CustomEvent<WordAnnotationClickDetail>).detail;
			const forms = allFormsRef.current;
			let found = isAnnotated
				? forms.find(f => f.normalized === normalized && f.pageOccurrences.some(o => o.tokenId === tokenId && o.isAnnotated))
				: forms.find(f => f.normalized === normalized);
			if (!found) found = forms.find(f => f.normalized === normalized);
			if (!found) return;
			setPopup({ x, y, form: found, tokenId, isAnnotated });
		};

		const handleDelete = (e: Event) => {
			const { normalized, tokenId } = (e as CustomEvent<WordAnnotationDeleteDetail>).detail;
			const form = allFormsRef.current.find(f => f.normalized === normalized);
			if (form) {
				setPopup(null);
				setDeleteInitialTokenId(tokenId);
				setBatchDeleteTarget(form);
			}
		};

		const handleEditForm = (e: Event) => {
			const normalized = (e as CustomEvent<string>).detail;
			const form = allFormsRef.current.find(f => f.normalized === normalized);
			if (form) setEditingForm(form);
		};

		document.addEventListener(WORD_ANNOTATIONS_PANEL_EVENT, handleToggle);
		document.addEventListener(WORD_ANNOTATION_CLICK_EVENT, handleClick);
		document.addEventListener(WORD_ANNOTATION_DELETE_EVENT, handleDelete);
		document.addEventListener(WORD_ANNOTATION_EDIT_FORM_EVENT, handleEditForm);
		return () => {
			document.removeEventListener(WORD_ANNOTATIONS_PANEL_EVENT, handleToggle);
			document.removeEventListener(WORD_ANNOTATION_CLICK_EVENT, handleClick);
			document.removeEventListener(WORD_ANNOTATION_DELETE_EVENT, handleDelete);
			document.removeEventListener(WORD_ANNOTATION_EDIT_FORM_EVENT, handleEditForm);
		};
	}, []);

	const handlePopupEdit = () => {
		if (!popup) return;
		setEditingForm(popup.form);
		setPopup(null);
	};

	const handlePopupDelete = () => {
		if (!popup) return;
		setPopup(null);
		setDeleteInitialTokenId(popup.tokenId);
		setBatchDeleteTarget(popup.form);
	};

	const handlePopupAnnotate = () => {
		if (!popup) return;
		setPopup(null);
		// Open the annotate dialog for this specific token
		document.dispatchEvent(
			new CustomEvent("admin:annotate-token", { detail: { tokenId: popup.tokenId, normalized: popup.form.normalized } }),
		);
	};

	const handleClosePanel = () => setIsOpen(false);
	const handleCloseBatchDelete = () => {
		setBatchDeleteTarget(null);
		setDeleteInitialTokenId(undefined);
	};

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
					{forms.length === 0 ? (
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
									onDelete={handleOpenDelete}
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
					isAnnotated={popup.isAnnotated}
					onEdit={handlePopupEdit}
					onDelete={handlePopupDelete}
					onAnnotate={handlePopupAnnotate}
					onDismiss={() => setPopup(null)}
				/>
			)}

			{editingForm && (
				<EditAnnotationDialog
					form={editingForm}
					textId={textId}
					pageNumber={pageNumber}
					open={Boolean(editingForm)}
					onOpenChange={() => setEditingForm(null)}
				/>
			)}

			{batchDeleteTarget && (
				<BatchDeleteAnnotationDialog
					form={batchDeleteTarget}
					textId={textId}
					pageNumber={pageNumber}
					initialTokenId={deleteInitialTokenId}
					open={Boolean(batchDeleteTarget)}
					onOpenChange={handleCloseBatchDelete}
				/>
			)}
		</>,
		document.body,
	);
};
