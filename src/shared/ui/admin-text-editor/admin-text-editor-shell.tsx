"use client";

import { useI18n } from "@/shared/lib/i18n";
import type { Editor, TipTapDoc } from "@/shared/ui/notion-editor";
import { NotionEditor } from "@/shared/ui/notion-editor";
import type { ReactNode } from "react";
import { useState } from "react";
import { AdminTextEditorFooter } from "./admin-text-editor-footer";
import { AdminTextEditorPageTabs } from "./admin-text-editor-page-tabs";
import { computeDocStats, PAGE_CHAR_LIMIT } from "./admin-text-editor-stats";
import { AdminTextEditorTitleField } from "./admin-text-editor-title-field";
import { EditorToolbar, getSlashItems } from "./admin-text-editor-toolbar";
import { AdminTextFindReplaceBar } from "./admin-text-find-replace-bar";
import { CharLimitMarkerExtension } from "./model/char-limit-marker-extension";
import { getAdminTextEditorShortcuts } from "./model/get-admin-text-editor-shortcuts";
import { useFindReplace } from "./model/use-find-replace";

interface AdminTextEditorShellProps {
	title: string;
	pages: { doc: TipTapDoc }[];
	activePage: number;
	stickyTopClassName: string;
	pagesSummary: string;
	primaryShortcutLabel: string;
	onTitleChange: (value: string) => void;
	onPageContentChange: (doc: TipTapDoc, wordCount: number) => void;
	onAddPage: () => void;
	onSelectPage: (index: number) => void;
	onSaveDraft: () => void;
	onPrimaryAction: () => void;
	getPageLabel: (index: number) => string;
	onDeletePage?: (index: number) => void;
	topContent?: ReactNode;
	toolbarExtraItems?: ReactNode;
	notionExtraToolbarItems?: ReactNode;
	onEditorReady?: (editor: Editor) => void;
}

export const AdminTextEditorShell = ({
	title,
	pages,
	activePage,
	stickyTopClassName,
	pagesSummary,
	primaryShortcutLabel,
	onTitleChange,
	onPageContentChange,
	onAddPage,
	onSelectPage,
	onSaveDraft,
	onPrimaryAction,
	getPageLabel,
	onDeletePage,
	topContent,
	toolbarExtraItems,
	notionExtraToolbarItems,
	onEditorReady,
}: AdminTextEditorShellProps) => {
	const { t } = useI18n();
	const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0 });
	const [editor, setEditor] = useState<Editor | null>(null);
	const findReplace = useFindReplace(editor);
	const slashItems = getSlashItems(t);
	const keyboardShortcuts = getAdminTextEditorShortcuts({
		t,
		primaryShortcutLabel,
	});

	const handleUpdate = (doc: TipTapDoc) => {
		const { words, chars, paragraphs } = computeDocStats(doc);
		onPageContentChange(doc, words);
		setStats({ words, chars, paragraphs });
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if ((event.ctrlKey || event.metaKey) && event.key === "s") {
			event.preventDefault();
			onSaveDraft();
			return true;
		}
		if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
			event.preventDefault();
			onPrimaryAction();
			return true;
		}
		if ((event.ctrlKey || event.metaKey) && event.key === "h") {
			event.preventDefault();
			findReplace.open();
			return true;
		}
		return false;
	};

	const handleEditorReady = (nextEditor: Editor) => {
		setEditor(nextEditor);
		onEditorReady?.(nextEditor);
	};

	return (
		<div className="flex min-h-0 min-w-0 flex-col overflow-hidden border-r border-bd-1 max-[767px]:border-r-0">
			{topContent}

			<AdminTextEditorTitleField
				value={title}
				placeholder={t("admin.texts.createPage.titlePlaceholder")}
				onChange={onTitleChange}
			/>

			<EditorToolbar
					editor={editor}
					t={t}
					extraItems={toolbarExtraItems}
					onFindReplace={findReplace.isOpen ? findReplace.close : findReplace.open}
					findReplaceOpen={findReplace.isOpen}
				/>

			{findReplace.isOpen && (
				<AdminTextFindReplaceBar
					query={findReplace.query}
					replacement={findReplace.replacement}
					matchLabel={findReplace.matchLabel}
					hasMatches={findReplace.hasMatches}
					searchInputRef={findReplace.searchInputRef}
					onQueryChange={findReplace.handleQueryChange}
					onReplacementChange={findReplace.handleReplacementChange}
					onFindNext={findReplace.handleFindNext}
					onFindPrev={findReplace.handleFindPrev}
					onReplaceActive={findReplace.handleReplaceActive}
					onReplaceAll={findReplace.handleReplaceAll}
					onClose={findReplace.close}
					onKeyDown={findReplace.handleKeyDown}
				/>
			)}

			<AdminTextEditorPageTabs
				pagesCount={pages.length}
				activePage={activePage}
				stickyTopClassName={stickyTopClassName}
				addPageTitle={t("admin.texts.createPage.addPage")}
				deletePageTitle={t("admin.texts.createPage.deletePage")}
				pagesSummary={pagesSummary}
				onAddPage={onAddPage}
				onSelectPage={onSelectPage}
				onDeletePage={onDeletePage}
				getPageLabel={getPageLabel}
			/>

			<div className="group relative flex-1 overflow-y-auto bg-surf px-[42px] py-[22px] pb-10 max-sm:px-4">
				<NotionEditor
					key={activePage}
					content={
						pages[activePage]?.doc ?? {
							type: "doc",
							content: [{ type: "paragraph" }],
						}
					}
					placeholder={t("admin.texts.createPage.startTyping")}
					slashMenuItems={slashItems}
					extraToolbarItems={notionExtraToolbarItems}
					extraExtensions={[
						CharLimitMarkerExtension.configure({
							limit: PAGE_CHAR_LIMIT,
							markerTitle: t("admin.texts.createPage.charLimitMarker"),
						}),
					]}
					onUpdate={handleUpdate}
					onKeyDown={handleKeyDown}
					onEditorReady={handleEditorReady}
				/>
			</div>

			<AdminTextEditorFooter
				stats={stats}
				labels={{
					words: t("admin.texts.createPage.words"),
					chars: t("admin.texts.createPage.chars"),
					paragraphs: t("admin.texts.createPage.paragraphs"),
					charsOverLimit: t("admin.texts.createPage.charsOverLimit"),
				}}
				charLimit={PAGE_CHAR_LIMIT}
				shortcuts={keyboardShortcuts}
				shortcutsButtonLabel={t("admin.texts.createPage.shortcuts.show")}
				shortcutsTitle={t("admin.texts.createPage.shortcuts.title")}
			/>
		</div>
	);
};
