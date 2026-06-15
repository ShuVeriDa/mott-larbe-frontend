"use client";

import { useAdminPagePhrases } from "@/entities/admin-text-phrase";
import { useAnnotatedFormsByPage } from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
	AdminTextConfirmModal,
	AdminTextEditorShell,
	hasTextContent,
} from "@/shared/ui/admin-text-editor";
import type { Editor, TipTapDoc, TipTapNode } from "@/shared/ui/notion-editor";
import { PhraseHighlightExtension } from "@/shared/ui/notion-editor";
import { WordAnnotationHighlightExtension } from "@/features/word-annotation";
import { Languages, Link2 } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import {
	type ComponentProps,
	useEffect,
	useRef,
	useState,
} from "react";
import { CharsPopup } from "../../admin-text-edit/ui/chars-popup";
import { PHRASE_FORM_EVENT } from "../../admin-text-edit/ui/phrase-translation-panel";
import {
	PHRASE_DELETE_EVENT,
	PHRASE_EDIT_EVENT,
	PHRASES_PANEL_EVENT,
} from "../../admin-text-edit/ui/phrases-list-panel";
import {
	WORD_ANNOTATION_DELETE_EVENT,
	WORD_ANNOTATION_EDIT_FORM_EVENT,
	WORD_ANNOTATIONS_PANEL_EVENT,
} from "../../admin-text-edit/ui/word-annotations-panel";

export type { TipTapDoc, TipTapNode };

export const ANNOTATE_WORD_FORM_EVENT = "admin:annotate-word-form";

const editorExtensions = [PhraseHighlightExtension, WordAnnotationHighlightExtension];

interface TextCreateEditorProps {
	title: string;
	pages: { doc: TipTapDoc; wordCount: number }[];
	activePage: number;
	showStressMark?: boolean;
	showSpellingAdd?: boolean;
	savedId: string | null;
	onTitleChange: (value: string) => void;
	onPageContentChange: (doc: TipTapDoc, wordCount: number) => void;
	onPageTitleChange: (value: string) => void;
	onAddPage: () => void;
	onSelectPage: (index: number) => void;
	onDeletePage: (index: number) => void;
	onSaveDraft: () => void;
	onPublish: () => void;
}

export const TextCreateEditor = ({
	title,
	pages,
	activePage,
	showStressMark = false,
	showSpellingAdd = false,
	savedId,
	onTitleChange,
	onPageContentChange,
	onPageTitleChange,
	onAddPage,
	onSelectPage,
	onDeletePage,
	onSaveDraft,
	onPublish,
}: TextCreateEditorProps) => {
	const { t } = useI18n();
	const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
	const editorRef = useRef<Editor | null>(null);
	const findReplaceInsertRef = useRef<((char: string) => boolean) | null>(null);
	const [editorVersion, setEditorVersion] = useState(0);

	// Only load phrase/annotation highlights when text has been saved
	const { data: phrasesData } = useAdminPagePhrases(savedId ?? "", activePage + 1);
	const phraseTexts = savedId
		? (phrasesData ?? []).map(p => p.phrase.original).filter(Boolean)
		: [];
	const phraseTextsRef = useRef<string[]>(phraseTexts);
	useEffect(() => {
		phraseTextsRef.current = phraseTexts;
	}, [phraseTexts]);

	const { data: annotatedFormsData } = useAnnotatedFormsByPage(savedId ?? "", activePage + 1);
	const annotatedForms = savedId ? (annotatedFormsData ?? []) : [];
	const annotatedFormsRef = useRef(annotatedForms);
	useEffect(() => {
		annotatedFormsRef.current = annotatedForms;
	}, [annotatedForms]);

	useEffect(() => {
		if (!savedId) return;
		const editor = editorRef.current;
		if (!editor) return;
		editor.commands.setPhraseHighlights(phraseTexts);
	}, [savedId, phraseTexts, editorVersion]);

	useEffect(() => {
		if (!savedId) return;
		const editor = editorRef.current;
		if (!editor) return;
		editor.commands.setWordAnnotationHighlights(annotatedForms);
	}, [savedId, annotatedForms, editorVersion]);

	const handleInsertChar: NonNullable<ComponentProps<typeof CharsPopup>["onInsert"]> = char => {
		if (findReplaceInsertRef.current?.(char)) return;
		editorRef.current?.chain().focus().insertContent(char).run();
	};

	const handleEditorReady: NonNullable<ComponentProps<typeof AdminTextEditorShell>["onEditorReady"]> = ed => {
		editorRef.current = ed;
		setEditorVersion(v => v + 1);
	};

	const isSelectedPhrase = (text: string) =>
		phraseTextsRef.current.some(p => p.toLowerCase() === text.toLowerCase());

	const handleBubbleEditPhrase = (text: string) => {
		const editor = editorRef.current;
		if (editor) {
			const { to } = editor.state.selection;
			editor.commands.setTextSelection(to);
			editor.commands.blur();
		}
		document.dispatchEvent(new Event("admin:open-phrase-form"));
		document.dispatchEvent(new CustomEvent<string>(PHRASE_EDIT_EVENT, { detail: text }));
	};

	const handleBubbleDeletePhrase = (text: string) => {
		document.dispatchEvent(new CustomEvent<string>(PHRASE_DELETE_EVENT, { detail: text }));
	};

	const isSelectedAnnotation = (text: string) =>
		annotatedFormsRef.current.some(f => f.normalized === text.trim().toLowerCase());

	const handleBubbleEditAnnotation = (text: string) => {
		const normalized = text.trim().toLowerCase();
		const editor = editorRef.current;
		if (editor) {
			const { to } = editor.state.selection;
			editor.commands.setTextSelection(to);
			editor.commands.blur();
		}
		document.dispatchEvent(new CustomEvent<string>(WORD_ANNOTATION_EDIT_FORM_EVENT, { detail: normalized }));
	};

	const handleBubbleDeleteAnnotation = (text: string) => {
		const normalized = text.trim().toLowerCase();
		const editor = editorRef.current;
		if (editor) {
			const { to } = editor.state.selection;
			editor.commands.setTextSelection(to);
			editor.commands.blur();
		}
		document.dispatchEvent(new CustomEvent(WORD_ANNOTATION_DELETE_EVENT, { detail: { normalized } }));
	};

	const charsPopup = <CharsPopup onInsert={handleInsertChar} />;

	const handlePhraseBtnMouseDown = (e: React.MouseEvent) => {
		const editor = editorRef.current;
		if (!editor) return;
		const { from, to } = editor.state.selection;
		const text = editor.state.doc.textBetween(from, to, " ").trim();
		if (!text || text.length < 2) return;
		e.preventDefault();
		document.dispatchEvent(new CustomEvent<string>(PHRASE_FORM_EVENT, { detail: text }));
		setTimeout(() => {
			editor.commands.setTextSelection(to);
			editor.commands.blur();
		}, 0);
	};

	const handleAnnotateBtnMouseDown = (e: React.MouseEvent) => {
		const editor = editorRef.current;
		if (!editor) return;
		const { from, to } = editor.state.selection;
		const text = editor.state.doc.textBetween(from, to, " ").trim();
		if (!text) return;
		e.preventDefault();
		document.dispatchEvent(new CustomEvent<string>(ANNOTATE_WORD_FORM_EVENT, { detail: text }));
		setTimeout(() => {
			editor.commands.setTextSelection(to);
			editor.commands.blur();
		}, 0);
	};

	const handlePhraseListBtnMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		document.dispatchEvent(new Event(PHRASES_PANEL_EVENT));
	};

	const handleWordAnnotationListBtnMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		document.dispatchEvent(new Event(WORD_ANNOTATIONS_PANEL_EVENT));
	};

	const currentPageTitle = pages[activePage]?.title ?? "";
	const handlePageTitleInputChange: NonNullable<ComponentProps<"input">["onChange"]> = e =>
		onPageTitleChange(e.currentTarget.value);

	const handleDeletePageRequest = (index: number) => {
		const hasContent = hasTextContent(pages[index].doc);
		if (hasContent) {
			setConfirmDeleteIndex(index);
		} else {
			onDeletePage(index);
		}
	};

	const handleConfirmDelete = () => {
		if (confirmDeleteIndex !== null) {
			onDeletePage(confirmDeleteIndex);
			setConfirmDeleteIndex(null);
		}
	};

	const handleCancelDelete = () => setConfirmDeleteIndex(null);

	const phraseBtn = (
		<Button
			title={t("admin.texts.editPage.addPhraseTranslation")}
			onMouseDown={savedId ? handlePhraseBtnMouseDown : undefined}
			disabled={!savedId}
			className="flex h-7 shrink-0 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-all duration-100 select-none hover:bg-surf-3 hover:text-t-1 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
		>
			<Languages className="size-[13px]" strokeWidth={1.7} />
		</Button>
	);

	const annotateBtn = (
		<Button
			title={t("admin.texts.editPage.wordAnnotation.bubbleBtn")}
			onMouseDown={savedId ? handleAnnotateBtnMouseDown : undefined}
			disabled={!savedId}
			className="flex h-7 shrink-0 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-all duration-100 select-none hover:bg-surf-3 hover:text-t-1 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
		>
			<Link2 className="size-[13px]" strokeWidth={1.7} />
		</Button>
	);

	const phraseListBtn = (
		<Button
			title={t("admin.texts.editPage.phraseListBtn")}
			onMouseDown={savedId ? handlePhraseListBtnMouseDown : undefined}
			disabled={!savedId}
			className="flex h-7 shrink-0 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-all duration-100 select-none hover:bg-surf-3 hover:text-t-1 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
		>
			<Languages className="size-[13px] text-violet-400" strokeWidth={1.7} />
			<Typography tag="span">{t("admin.texts.editPage.phraseListBtn")}</Typography>
		</Button>
	);

	const wordAnnotationListBtn = (
		<Button
			title={t("admin.texts.editPage.wordAnnotation.panelListBtn")}
			onMouseDown={savedId ? handleWordAnnotationListBtnMouseDown : undefined}
			disabled={!savedId}
			className="flex h-7 shrink-0 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-all duration-100 select-none hover:bg-surf-3 hover:text-t-1 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
		>
			<Link2 className="size-[13px] text-acc" strokeWidth={1.7} />
			<Typography tag="span">{t("admin.texts.editPage.wordAnnotation.panelListBtn")}</Typography>
		</Button>
	);

	return (
		<>
			<AdminTextEditorShell
				title={title}
				pages={pages}
				activePage={activePage}
				stickyTopClassName="top-[52px]"
				pagesSummary={t("admin.texts.createPage.pages", { n: pages.length })}
				primaryShortcutLabel={t("admin.texts.createPage.publish")}
				showStressMark={showStressMark}
			showSpellingAdd={showSpellingAdd}
				extraExtensions={savedId ? editorExtensions : []}
				isSelectedPhrase={savedId ? isSelectedPhrase : undefined}
				onBubbleEditPhrase={savedId ? handleBubbleEditPhrase : undefined}
				onBubbleDeletePhrase={savedId ? handleBubbleDeletePhrase : undefined}
				isSelectedAnnotation={savedId ? isSelectedAnnotation : undefined}
				onBubbleEditAnnotation={savedId ? handleBubbleEditAnnotation : undefined}
				onBubbleDeleteAnnotation={savedId ? handleBubbleDeleteAnnotation : undefined}
				toolbarExtraItems={
					<>
						{charsPopup}
						{phraseListBtn}
						{wordAnnotationListBtn}
					</>
				}
				notionExtraToolbarItems={
					<>
						{charsPopup}
						{phraseBtn}
						{annotateBtn}
					</>
				}
				findReplaceCharHandlerRef={findReplaceInsertRef}
				findReplaceCharsPicker={charsPopup}
				onEditorReady={handleEditorReady}
				pageHeaderContent={
					<div className="border-b border-bd-1 bg-surf px-[22px] pb-2 pt-2 max-sm:px-4">
						<Input
							type="text"
							value={currentPageTitle}
							onChange={handlePageTitleInputChange}
							placeholder={t("admin.texts.editPage.pageTitlePlaceholder")}
							maxLength={100}
							className="w-full border-none bg-transparent text-[14px] font-normal leading-snug text-t-1 outline-none placeholder:text-t-4"
						/>
					</div>
				}
				onTitleChange={onTitleChange}
				onPageContentChange={onPageContentChange}
				onAddPage={onAddPage}
				onSelectPage={onSelectPage}
				onSaveDraft={onSaveDraft}
				onPrimaryAction={onPublish}
				onDeletePage={handleDeletePageRequest}
				getPageLabel={index => t("admin.texts.createPage.pageN", { n: index + 1 })}
			/>

			{confirmDeleteIndex !== null && (
				<AdminTextConfirmModal
					title={t("admin.texts.createPage.deletePageTitle")}
					description={t("admin.texts.createPage.deletePageBody", {
						n: confirmDeleteIndex + 1,
					})}
					cancelLabel={t("admin.texts.createPage.deletePageCancel")}
					confirmLabel={t("admin.texts.createPage.deletePageConfirm")}
					onConfirm={handleConfirmDelete}
					onCancel={handleCancelDelete}
				/>
			)}
		</>
	);
};
