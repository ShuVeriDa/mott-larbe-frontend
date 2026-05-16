"use client";

import type { ProcessingStatus } from "@/entities/admin-text";
import { useAdminPagePhrases } from "@/entities/admin-text-phrase";
import { useAnnotatedFormsByPage } from "@/features/word-annotation";
import { useI18n } from "@/shared/lib/i18n";
import { AdminTextEditorShell } from "@/shared/ui/admin-text-editor";
import type { Editor, TipTapDoc } from "@/shared/ui/notion-editor";
import { PhraseHighlightExtension, WordAnnotationHighlightExtension } from "@/shared/ui/notion-editor";
import { Languages, Link2 } from "lucide-react";
import { type ComponentProps, useEffect, useMemo, useRef } from "react";
import type { PageContent } from "../model/use-admin-text-edit-page";
import { CharsPopup } from "./chars-popup";
import { PHRASE_FORM_EVENT } from "./phrase-translation-panel";
import {
	PHRASE_DELETE_EVENT,
	PHRASE_EDIT_EVENT,
	PHRASES_PANEL_EVENT,
} from "./phrases-list-panel";
import { TextEditRetokenizeBar } from "./text-edit-retokenize-bar";
import { TextEditTokenStatusBar } from "./text-edit-token-status-bar";
import { WORD_ANNOTATIONS_PANEL_EVENT } from "./word-annotations-panel";

export const ANNOTATE_WORD_FORM_EVENT = "admin:annotate-word-form";

interface TextEditEditorProps {
	title: string;
	pages: PageContent[];
	activePage: number;
	processingStatus: ProcessingStatus;
	processingProgress: number;
	tokenCount: number;
	showRetokenizeBar: boolean;
	textId: string;
	onTitleChange: (value: string) => void;
	onPageContentChange: (doc: TipTapDoc, wordCount: number) => void;
	onAddPage: () => void;
	onSelectPage: (index: number) => void;
	onSaveDraft: () => void;
	onSaveAndUpdate: () => void;
	onDismissRetokenize: () => void;
}

export const TextEditEditor = ({
	title,
	pages,
	activePage,
	processingStatus,
	processingProgress,
	tokenCount,
	showRetokenizeBar,
	textId,
	onTitleChange,
	onPageContentChange,
	onAddPage,
	onSelectPage,
	onSaveDraft,
	onSaveAndUpdate,
	onDismissRetokenize,
}: TextEditEditorProps) => {
	const { t, lang } = useI18n();
	const editorRef = useRef<Editor | null>(null);
	const findReplaceInsertRef = useRef<((char: string) => boolean) | null>(null);

	// Load phrases for current page to highlight in editor
	const { data: phrasesData } = useAdminPagePhrases(textId, activePage + 1);
	const phraseTexts = useMemo(
		() => (phrasesData ?? []).map(p => p.phrase.original).filter(Boolean),
		[phrasesData],
	);
	const phraseTextsRef = useRef<string[]>(phraseTexts);
	useEffect(() => {
		phraseTextsRef.current = phraseTexts;
	}, [phraseTexts]);

	// Load annotated word forms for current page to highlight in editor
	const { data: annotatedFormsData } = useAnnotatedFormsByPage(textId, activePage + 1);
	const annotatedForms = useMemo(
		() => (annotatedFormsData ?? []).map(f => f.normalized).filter(Boolean),
		[annotatedFormsData],
	);

	const editorExtensions = useMemo(() => [PhraseHighlightExtension, WordAnnotationHighlightExtension], []);

	useEffect(() => {
		const editor = editorRef.current;
		if (!editor) return;
		editor.commands.setPhraseHighlights(phraseTexts);
	}, [phraseTexts]);

	useEffect(() => {
		const editor = editorRef.current;
		if (!editor) return;
		editor.commands.setWordAnnotationHighlights(annotatedForms);
	}, [annotatedForms]);

	const handleInsertChar: NonNullable<
		ComponentProps<typeof CharsPopup>["onInsert"]
	> = char => {
		if (findReplaceInsertRef.current?.(char)) return;
		editorRef.current?.chain().focus().insertContent(char).run();
	};

	const handleEditorReady: NonNullable<
		ComponentProps<typeof AdminTextEditorShell>["onEditorReady"]
	> = ed => {
		editorRef.current = ed;
		if (phraseTexts.length) {
			ed.commands.setPhraseHighlights(phraseTexts);
		}
		if (annotatedForms.length) {
			ed.commands.setWordAnnotationHighlights(annotatedForms);
		}
	};

	const isSelectedPhrase = (text: string) =>
		phraseTextsRef.current.some(p => p.toLowerCase() === text.toLowerCase());

	// Bubble menu "Редактировать" → collapse selection (hides bubble menu), open EditModal directly
	const handleBubbleEditPhrase = (text: string) => {
		const editor = editorRef.current;
		if (editor) {
			const { to } = editor.state.selection;
			editor.commands.setTextSelection(to);
			editor.commands.blur();
		}
		document.dispatchEvent(new Event("admin:open-phrase-form"));
		document.dispatchEvent(
			new CustomEvent<string>(PHRASE_EDIT_EVENT, { detail: text }),
		);
	};

	// Bubble menu "Удалить" → delete directly
	const handleBubbleDeletePhrase = (text: string) => {
		document.dispatchEvent(
			new CustomEvent<string>(PHRASE_DELETE_EVENT, { detail: text }),
		);
	};
	const charsPopup = <CharsPopup onInsert={handleInsertChar} />;

	const handlePhraseBtnMouseDown = (e: React.MouseEvent) => {
		// Capture selection text before mousedown clears it
		const editor = editorRef.current;
		if (!editor) return;
		const { from, to } = editor.state.selection;
		const text = editor.state.doc.textBetween(from, to, " ").trim();
		if (!text || text.length < 2) return;
		// Prevent focus loss so selection stays readable, then blur after dispatch
		e.preventDefault();
		document.dispatchEvent(
			new CustomEvent<string>(PHRASE_FORM_EVENT, { detail: text }),
		);
		// Collapse selection and blur so BubbleMenu hides itself
		setTimeout(() => {
			editor.commands.setTextSelection(to);
			editor.commands.blur();
		}, 0);
	};

	const phraseBtn = (
		<button
			title={t("admin.texts.editPage.addPhraseTranslation")}
			onMouseDown={handlePhraseBtnMouseDown}
			className="flex h-7 shrink-0 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-all duration-100 select-none hover:bg-surf-3 hover:text-t-1 active:scale-95"
		>
			<Languages className="size-[13px]" strokeWidth={1.7} />
		</button>
	);

	const handleAnnotateBtnMouseDown = (e: React.MouseEvent) => {
		const editor = editorRef.current;
		if (!editor) return;
		const { from, to } = editor.state.selection;
		const text = editor.state.doc.textBetween(from, to, " ").trim();
		if (!text) return;
		e.preventDefault();
		document.dispatchEvent(
			new CustomEvent<string>(ANNOTATE_WORD_FORM_EVENT, { detail: text }),
		);
		setTimeout(() => {
			editor.commands.setTextSelection(to);
			editor.commands.blur();
		}, 0);
	};

	const annotateBtn = (
		<button
			title={t("admin.texts.editPage.wordAnnotation.bubbleBtn")}
			onMouseDown={handleAnnotateBtnMouseDown}
			className="flex h-7 shrink-0 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-all duration-100 select-none hover:bg-surf-3 hover:text-t-1 active:scale-95"
		>
			<Link2 className="size-[13px]" strokeWidth={1.7} />
		</button>
	);

	const phraseListBtn = (
		<button
			title={t("admin.texts.editPage.phraseListBtn")}
			onMouseDown={e => {
				e.preventDefault();
				document.dispatchEvent(new Event(PHRASES_PANEL_EVENT));
			}}
			className="flex h-7 shrink-0 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-all duration-100 select-none hover:bg-surf-3 hover:text-t-1 active:scale-95"
		>
			<Languages className="size-[13px] text-violet-400" strokeWidth={1.7} />
			<span>{t("admin.texts.editPage.phraseListBtn")}</span>
		</button>
	);

	const handleWordAnnotationListBtnMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		document.dispatchEvent(new Event(WORD_ANNOTATIONS_PANEL_EVENT));
	};

	const wordAnnotationListBtn = (
		<button
			title={t("admin.texts.editPage.wordAnnotation.panelListBtn")}
			onMouseDown={handleWordAnnotationListBtnMouseDown}
			className="flex h-7 shrink-0 items-center gap-1 rounded-[6px] px-2 text-[12px] font-medium text-t-2 transition-all duration-100 select-none hover:bg-surf-3 hover:text-t-1 active:scale-95"
		>
			<Link2 className="size-[13px] text-acc" strokeWidth={1.7} />
			<span>{t("admin.texts.editPage.wordAnnotation.panelListBtn")}</span>
		</button>
	);

	return (
		<AdminTextEditorShell
			title={title}
			pages={pages}
			activePage={activePage}
			stickyTopClassName="top-[52px]"
			pagesSummary={
				tokenCount > 0
					? t("admin.texts.editPage.pagesTokens", {
							n: pages.length,
							tokens: tokenCount,
						})
					: t("admin.texts.createPage.pages", { n: pages.length })
			}
			primaryShortcutLabel={t("admin.texts.editPage.saveUpdate")}
			onTitleChange={onTitleChange}
			onPageContentChange={onPageContentChange}
			onAddPage={onAddPage}
			onSelectPage={onSelectPage}
			onSaveDraft={onSaveDraft}
			onPrimaryAction={onSaveAndUpdate}
			getPageLabel={index =>
				t("admin.texts.createPage.pageN", { n: index + 1 })
			}
			topContent={
				<>
					<TextEditTokenStatusBar
						processingStatus={processingStatus}
						processingProgress={processingProgress}
						tokenCount={tokenCount}
						pages={pages}
						textId={textId}
						lang={lang}
						t={t}
					/>
					{showRetokenizeBar && (
						<TextEditRetokenizeBar onDismiss={onDismissRetokenize} t={t} />
					)}
				</>
			}
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
			extraExtensions={editorExtensions}
			isSelectedPhrase={isSelectedPhrase}
			onBubbleEditPhrase={handleBubbleEditPhrase}
			onBubbleDeletePhrase={handleBubbleDeletePhrase}
		/>
	);
};
