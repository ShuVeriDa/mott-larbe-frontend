"use client";

import type { ProcessingStatus } from "@/entities/admin-text";
import { useI18n } from "@/shared/lib/i18n";
import { AdminTextEditorShell } from "@/shared/ui/admin-text-editor";
import type { Editor, TipTapDoc } from "@/shared/ui/notion-editor";
import { type ComponentProps, useRef } from "react";
import type { PageContent } from "../model/use-admin-text-edit-page";
import { CharsPopup } from "./chars-popup";
import { TextEditRetokenizeBar } from "./text-edit-retokenize-bar";
import { TextEditTokenStatusBar } from "./text-edit-token-status-bar";

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

	const handleInsertChar: NonNullable<
		ComponentProps<typeof CharsPopup>["onInsert"]
	> = char => {
		editorRef.current?.chain().focus().insertContent(char).run();
	};

	const handleEditorReady: NonNullable<
		ComponentProps<typeof AdminTextEditorShell>["onEditorReady"]
	> = ed => {
		editorRef.current = ed;
	};
	const charsPopup = <CharsPopup onInsert={handleInsertChar} />;

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
			getPageLabel={index => t("admin.texts.createPage.pageN", { n: index + 1 })}
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
			toolbarExtraItems={charsPopup}
			notionExtraToolbarItems={charsPopup}
			onEditorReady={handleEditorReady}
		/>
	);
};
