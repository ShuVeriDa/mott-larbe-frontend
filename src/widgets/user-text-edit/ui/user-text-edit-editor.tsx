"use client";

import { useRef, useState } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { AdminTextEditorShell, hasTextContent } from "@/shared/ui/admin-text-editor";
import { Input } from "@/shared/ui/input";
import type { Editor, TipTapDoc } from "@/shared/ui/notion-editor";
import type { GeneratedTextResult } from "@/entities/text-generation";
import type { GenerationApplyMode } from "@/features/generate-user-text";
import type { UserTextLanguage } from "@/entities/user-text";
import type { EditorMode, PageContent } from "../model/use-user-text-edit-page";
import { CharsPopup } from "@/shared/ui/chars-popup";
import { OrthographyPreviewToggle } from "@/features/reader-script";
import { UserTextEditorModeTabs } from "./user-text-editor-mode-tabs";
import { UserTextGenerateMode } from "./user-text-generate-mode";

const SUPPORTED_GENERATION_LANGUAGES = ["CHE", "RU", "AR", "EN"] as const;
const isUserTextLanguage = (value: string | undefined): value is UserTextLanguage =>
  (SUPPORTED_GENERATION_LANGUAGES as readonly string[]).includes(value ?? "");

interface UserTextEditEditorProps {
  title: string;
  language?: string;
  pages: PageContent[];
  activePage: number;
  pageTitles?: string[];
  showSpellingAdd?: boolean;
  editorMode?: EditorMode;
  onTitleChange: (value: string) => void;
  onPageContentChange: (doc: TipTapDoc) => void;
  onPageTitleChange?: (value: string) => void;
  onAddPage: () => void;
  onSelectPage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onSaveDraft: () => void;
  onPrimaryAction: () => void;
  onEditorModeChange?: (mode: EditorMode) => void;
  onGenerated?: (
    result: GeneratedTextResult,
    selectedWordsCount: number,
    applyMode: GenerationApplyMode,
  ) => void;
  onNeedsGeminiKey?: () => void;
}

export const UserTextEditEditor = ({
  title,
  language,
  pages,
  activePage,
  pageTitles,
  showSpellingAdd = false,
  editorMode,
  onTitleChange,
  onPageContentChange,
  onPageTitleChange,
  onAddPage,
  onSelectPage,
  onDeletePage,
  onSaveDraft,
  onPrimaryAction,
  onEditorModeChange,
  onGenerated,
  onNeedsGeminiKey,
}: UserTextEditEditorProps) => {
  const { t } = useI18n();
  const editorRef = useRef<Editor | null>(null);
  const findReplaceInsertRef = useRef<((char: string) => boolean) | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const canGenerate = Boolean(onEditorModeChange && onGenerated && onNeedsGeminiKey);
  const activeDoc = pages[activePage]?.doc;
  const isActivePageEmpty = !activeDoc || !hasTextContent(activeDoc);
  const showGenerateTab = canGenerate;

  const handleEditorReady = (ed: Editor) => { editorRef.current = ed; };

  const handlePageContentChange = (doc: TipTapDoc, _wordCount: number) => {
    onPageContentChange(doc);
  };

  const handlePageTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPageTitleChange?.(e.currentTarget.value);
  };

  // Same pattern as admin TextEditEditor.handleInsertChar
  const handleInsertChar = (char: string) => {
    if (findReplaceInsertRef.current?.(char)) return;
    editorRef.current?.chain().focus().insertContent(char).run();
  };

  const currentPageTitle = pageTitles?.[activePage] ?? "";

  const charsPopup = <CharsPopup onInsert={handleInsertChar} />;
  const orthographyPreview = (
    <OrthographyPreviewToggle language={language ?? ""} editorRef={editorRef} />
  );

  const modeTabs = showGenerateTab && editorMode && onEditorModeChange ? (
    <UserTextEditorModeTabs mode={editorMode} disableWriteTab={isGenerating} onModeChange={onEditorModeChange} />
  ) : null;

  if (showGenerateTab && editorMode === "generate" && onGenerated && onNeedsGeminiKey) {
    return (
      <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
        {modeTabs}
        <UserTextGenerateMode
          title={title}
          language={isUserTextLanguage(language) ? language : "CHE"}
          isActivePageEmpty={isActivePageEmpty}
          onTitleChange={onTitleChange}
          onGenerated={onGenerated}
          onNeedsGeminiKey={onNeedsGeminiKey}
          onGeneratingChange={setIsGenerating}
        />
      </div>
    );
  }

  return (
    <AdminTextEditorShell
      title={title}
      pages={pages}
      activePage={activePage}
      stickyTopClassName="top-[52px]"
      pagesSummary={t("admin.texts.createPage.pages", { n: pages.length })}
      primaryShortcutLabel={t("myTexts.create")}
      onTitleChange={onTitleChange}
      onPageContentChange={handlePageContentChange}
      onAddPage={onAddPage}
      onSelectPage={onSelectPage}
      onDeletePage={onDeletePage}
      onSaveDraft={onSaveDraft}
      onPrimaryAction={onPrimaryAction}
      getPageLabel={index => t("admin.texts.createPage.pageN", { n: index + 1 })}
      onEditorReady={handleEditorReady}
      topContent={modeTabs}
      toolbarExtraItems={<>{charsPopup}{orthographyPreview}</>}
      notionExtraToolbarItems={<>{charsPopup}{orthographyPreview}</>}
      findReplaceCharHandlerRef={findReplaceInsertRef}
      findReplaceCharsPicker={charsPopup}
      showSpellingAdd={showSpellingAdd}
      pageHeaderContent={
        <div className="border-b border-bd-1 bg-surf px-[22px] pb-2 pt-2 max-sm:px-4">
          <Input
            type="text"
            value={currentPageTitle}
            onChange={handlePageTitleChange}
            placeholder={t("admin.texts.editPage.pageTitlePlaceholder")}
            maxLength={100}
            className="w-full border-none bg-transparent text-[14px] font-normal leading-snug text-t-1 outline-none placeholder:text-t-4"
          />
        </div>
      }
    />
  );
};
