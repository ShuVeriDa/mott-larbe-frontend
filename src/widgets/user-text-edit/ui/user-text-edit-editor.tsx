"use client";

import { useRef } from "react";
import { useI18n } from "@/shared/lib/i18n";
import { AdminTextEditorShell } from "@/shared/ui/admin-text-editor";
import { Input } from "@/shared/ui/input";
import type { Editor, TipTapDoc } from "@/shared/ui/notion-editor";
import type { PageContent } from "../model/use-user-text-edit-page";
import { CharsPopup } from "@/shared/ui/chars-popup";
import { OrthographyPreviewToggle } from "@/features/reader-script";

interface UserTextEditEditorProps {
  title: string;
  language?: string;
  pages: PageContent[];
  activePage: number;
  pageTitles?: string[];
  showSpellingAdd?: boolean;
  onTitleChange: (value: string) => void;
  onPageContentChange: (doc: TipTapDoc) => void;
  onPageTitleChange?: (value: string) => void;
  onAddPage: () => void;
  onSelectPage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onSaveDraft: () => void;
  onPrimaryAction: () => void;
}

export const UserTextEditEditor = ({
  title,
  language,
  pages,
  activePage,
  pageTitles,
  showSpellingAdd = false,
  onTitleChange,
  onPageContentChange,
  onPageTitleChange,
  onAddPage,
  onSelectPage,
  onDeletePage,
  onSaveDraft,
  onPrimaryAction,
}: UserTextEditEditorProps) => {
  const { t } = useI18n();
  const editorRef = useRef<Editor | null>(null);
  const findReplaceInsertRef = useRef<((char: string) => boolean) | null>(null);

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
