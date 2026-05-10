"use client";

import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import type { ProcessingStatus } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { EditorToolbar, getSlashItems } from "@/shared/ui/admin-text-editor";
import type { Editor, TipTapDoc } from "@/shared/ui/notion-editor";
import { NotionEditor } from "@/shared/ui/notion-editor";
import { type ChangeEvent, type ComponentProps, useRef, useState } from "react";
import { countChars, countParagraphs, countWords } from "../lib/tiptap-utils";
import type { PageContent } from "../model/use-admin-text-edit-page";
import { CharsPopup } from "./chars-popup";
import { AlertTriangle, CheckCircle2, AlignLeft, Plus } from "lucide-react";

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

const TokenStatusBar = ({
	processingStatus,
	processingProgress,
	tokenCount,
	pages,
	textId,
	lang,
	t,
}: {
	processingStatus: ProcessingStatus;
	processingProgress: number;
	tokenCount: number;
	pages: PageContent[];
	textId: string;
	lang: string;
	t: ReturnType<typeof useI18n>["t"];
}) => {
	if (processingStatus === "RUNNING") {
		return (
			<div className="flex items-center gap-2 border-b border-bd-1 bg-acc-muted px-6 py-2 transition-colors">
				<Typography tag="span" className="inline-block h-3.5 w-3.5 shrink-0 animate-spin rounded-full border border-acc border-t-transparent" />
				<Typography tag="span" className="flex-1 text-[11.5px] text-acc-strong">
					{t("admin.texts.editPage.tokenBar.running")}{" "}
					{processingProgress > 0 ? `${processingProgress}%` : ""}
				</Typography>
			</div>
		);
	}
	if (processingStatus === "ERROR") {
		return (
			<div className="flex items-center gap-2 border-b border-red/10 bg-red-muted px-6 py-2 transition-colors">
				<AlertTriangle className="size-4 shrink-0 text-red" />
				<Typography tag="span" className="flex-1 text-[11.5px] text-red-strong">
					{t("admin.texts.editPage.tokenBar.error")}
				</Typography>
			</div>
		);
	}
	if (processingStatus === "COMPLETED" && tokenCount > 0) {
		return (
			<div className="flex items-center gap-2 border-b border-bd-1 bg-grn-muted px-6 py-2 transition-colors">
				<CheckCircle2 className="size-4 shrink-0 text-grn" />
				<Typography tag="span" className="flex-1 text-[11.5px] text-grn-strong">
					{t("admin.texts.editPage.tokenBar.done", { pages: pages.length, tokens: tokenCount })}
				</Typography>
				<a
					href={`/${lang}/admin/texts/${textId}/versions`}
					className="shrink-0 text-[11px] font-medium text-acc transition-opacity hover:opacity-75"
				>
					{t("admin.texts.editPage.tokenBar.versions")} →
				</a>
			</div>
		);
	}
	return null;
};

const RetokenizeBar = ({
	onDismiss,
	t,
}: {
	onDismiss: () => void;
	t: ReturnType<typeof useI18n>["t"];
}) => (
	<div className="flex items-center gap-2 border-b border-amb/15 bg-amb-muted px-6 py-2 transition-colors">
		<AlertTriangle className="size-[15px] shrink-0 text-amb" />
		<Typography tag="span" className="flex-1 text-[11.5px] text-amb-strong">
			{t("admin.texts.editPage.retokenizeBar.text")}
		</Typography>
		<Button
			onClick={onDismiss}
			className="shrink-0 rounded-[4px] px-1.5 py-0.5 text-[11px] text-t-3 transition-colors hover:bg-surf-3"
		>
			✕
		</Button>
	</div>
);

const EditorFooter = ({
	stats,
	t,
}: {
	stats: { words: number; chars: number; paragraphs: number };
	t: ReturnType<typeof useI18n>["t"];
}) => (
	<div className="flex flex-wrap items-center gap-3 border-t border-bd-1 bg-surf-2 px-[22px] py-[7px] text-[11px] text-t-3 transition-colors max-sm:px-4">
		<div className="flex items-center gap-1">
			<AlignLeft className="size-3" />
			{t("admin.texts.createPage.words")}:&nbsp;
			<Typography tag="span" className="font-medium text-t-2">{stats.words}</Typography>
		</div>
		<div className="h-3 w-px bg-bd-2" />
		<div>
			{t("admin.texts.createPage.chars")}:&nbsp;
			<Typography tag="span" className="font-medium text-t-2">{stats.chars}</Typography>
		</div>
		<div className="h-3 w-px bg-bd-2 max-sm:hidden" />
		<div className="max-sm:hidden">
			{t("admin.texts.createPage.paragraphs")}:&nbsp;
			<Typography tag="span" className="font-medium text-t-2">{stats.paragraphs}</Typography>
		</div>
	</div>
);

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
	const titleRef = useRef<HTMLTextAreaElement>(null);
	const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 });
	const [editor, setEditor] = useState<Editor | null>(null);
	const editorRef = useRef<Editor | null>(null);
	const slashItems = getSlashItems(t);

	const adjustTitleHeight = () => {
		if (titleRef.current) {
			titleRef.current.style.height = "auto";
			titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
		}
	};

	const handleTitleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
		onTitleChange(e.currentTarget.value);
		adjustTitleHeight();
	};

	const handleUpdate = (doc: TipTapDoc) => {
		const wc = countWords(doc);
		onPageContentChange(doc, wc);
		setStats({ words: wc, chars: countChars(doc), paragraphs: countParagraphs(doc) });
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key === "s") {
			event.preventDefault();
			onSaveDraft();
			return true;
		}
		if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
			event.preventDefault();
			onSaveAndUpdate();
			return true;
		}
		return false;
	};

	const handleInsertChar: NonNullable<ComponentProps<typeof CharsPopup>["onInsert"]> = char => {
		editorRef.current?.chain().focus().insertContent(char).run();
	};

	const handleEditorReady: NonNullable<ComponentProps<typeof NotionEditor>["onEditorReady"]> = ed => {
		editorRef.current = ed;
		setEditor(ed);
	};

	const titleLen = title.length;
	const titleWarn = titleLen > 160;

	const keyboardHints = (
		<>
			<Typography tag="span" className="rounded-[3px] bg-surf-3 px-1 py-px text-t-3">Ctrl+S</Typography>
			<Typography tag="span">—</Typography>
			<Typography tag="span">{t("admin.texts.editPage.saveDraft")}</Typography>
			<Typography tag="span" className="ml-1 rounded-[3px] bg-surf-3 px-1 py-px text-t-3">Ctrl+↵</Typography>
			<Typography tag="span">—</Typography>
			<Typography tag="span">{t("admin.texts.editPage.saveUpdate")}</Typography>
			<Typography tag="span" className="ml-2 rounded-[3px] bg-surf-3 px-1 py-px text-t-3">/</Typography>
			<Typography tag="span">—</Typography>
			<Typography tag="span">блоки</Typography>
		</>
	);

	return (
		<div className="flex min-w-0 flex-col border-r border-bd-1 max-[900px]:border-r-0">
			<TokenStatusBar
				processingStatus={processingStatus}
				processingProgress={processingProgress}
				tokenCount={tokenCount}
				pages={pages}
				textId={textId}
				lang={lang}
				t={t}
			/>

			{showRetokenizeBar && <RetokenizeBar onDismiss={onDismissRetokenize} t={t} />}

			<div className="border-b border-bd-1 px-[22px] pt-5 max-sm:px-4 max-sm:pt-4 bg-surf">
				<textarea
					ref={titleRef}
					value={title}
					onChange={handleTitleInput}
					placeholder={t("admin.texts.createPage.titlePlaceholder")}
					rows={1}
					maxLength={200}
					className="w-full resize-none overflow-hidden border-none bg-transparent font-display text-[22px] font-normal leading-[1.35] text-t-1 outline-none placeholder:text-t-4 max-sm:text-[18px]"
				/>
				<div className={`pb-2.5 pt-1 text-right text-[10.5px] ${titleWarn ? "text-amb" : "text-t-4"}`}>
					{titleLen} / 200
				</div>
			</div>

			<EditorToolbar
				editor={editor}
				t={t}
				keyboardHints={keyboardHints}
				extraItems={<CharsPopup onInsert={handleInsertChar} />}
			/>

			<div className="sticky top-[52px] z-10 flex items-center overflow-x-auto border-b border-bd-1 bg-surf px-3.5 transition-colors [scrollbar-width:none]">
				{pages.map((_, i) => {
					const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => onSelectPage(i);
					return (
						<div
							key={i}
							className={`group/tab flex h-9 shrink-0 items-center gap-1 border-b-2 pl-3 pr-1.5 transition-colors ${
								i === activePage
									? "border-acc text-acc-strong"
									: "border-transparent text-t-3 hover:text-t-2"
							}`}
						>
							<Button onClick={handleClick} className="flex items-center gap-1.5 text-xs">
								<Typography
									tag="span"
									className={`flex h-[17px] w-[17px] items-center justify-center rounded-[4px] text-[10px] font-semibold ${
										i === activePage ? "bg-acc-muted text-acc-strong" : "bg-surf-3 text-t-3"
									}`}
								>
									{i + 1}
								</Typography>
								{t("admin.texts.createPage.pageN", { n: i + 1 })}
							</Button>
						</div>
					);
				})}

				<Button
					title={t("admin.texts.createPage.addPage")}
					onClick={onAddPage}
					className="ml-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[5px] text-t-3 transition-colors hover:bg-surf-3 hover:text-t-2"
				>
					<Plus className="size-3.5" />
				</Button>

				<div className="ml-auto shrink-0 pl-2 text-[11px] text-t-3">
					{tokenCount > 0
						? t("admin.texts.editPage.pagesTokens", { n: pages.length, tokens: tokenCount })
						: t("admin.texts.createPage.pages", { n: pages.length })}
				</div>
			</div>

			<div className="group relative flex-1 px-[22px] py-[22px] pb-10 max-sm:px-4 bg-surf">
				<NotionEditor
					key={activePage}
					content={pages[activePage]?.doc ?? { type: "doc", content: [{ type: "paragraph" }] }}
					placeholder={t("admin.texts.createPage.startTyping")}
					slashMenuItems={slashItems}
					extraToolbarItems={<CharsPopup onInsert={handleInsertChar} />}
					onUpdate={handleUpdate}
					onKeyDown={handleKeyDown}
					onEditorReady={handleEditorReady}
				/>
			</div>

			<EditorFooter stats={stats} t={t} />
		</div>
	);
};
