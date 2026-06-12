"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { AdminTextPageShell } from "@/shared/ui/admin-text-editor";
import { useI18n } from "@/shared/lib/i18n";
import { useUserTextEditPage } from "../model/use-user-text-edit-page";
import { UserTextEditTopbar } from "./user-text-edit-topbar";
import { UserTextEditEditor } from "./user-text-edit-editor";
import { UserTextEditMetaPanel } from "./user-text-edit-meta-panel";

interface UserTextEditPageInnerProps {
  id: string;
  lang: string;
  isMetaPanelVisible: boolean;
  onToggleMetaPanel: () => void;
}

// Inner component calls useSuspenseQuery — must be wrapped in <Suspense> by parent
const UserTextEditPageInner = ({
  id, lang, isMetaPanelVisible, onToggleMetaPanel,
}: UserTextEditPageInnerProps) => {
  const { t } = useI18n();
  const {
    title, language, type, author, sourceUrl,
    description, coverPreviewUrl, genreId,
    pages, pageTitles, activePage, isUnsaved, isSaving,
    handleTitleChange, handleLanguageChange, handleTypeChange,
    handleAuthorChange, handleSourceChange,
    handleDescriptionChange, handleGenreChange, handleCoverSelect, handleCoverRemove,
    handlePageContentChange, handlePageTitleChange,
    handleAddPage, handleSelectPage, handleDeletePage,
    handleSaveDraft, handlePrimaryAction, handleSubmitForReview,
  } = useUserTextEditPage(id, lang);

  return (
    <AdminTextPageShell
      isMetaPanelVisible={isMetaPanelVisible}
      topbar={
        <UserTextEditTopbar
          title={title}
          isUnsaved={isUnsaved}
          isSaving={isSaving}
          isMetaPanelVisible={isMetaPanelVisible}
          mode="edit"
          onSaveDraft={handleSaveDraft}
          onPrimaryAction={handlePrimaryAction}
          onToggleMetaPanel={onToggleMetaPanel}
          onSubmitForReview={handleSubmitForReview}
        />
      }
      editor={
        <UserTextEditEditor
          title={title}
          pages={pages}
          pageTitles={pageTitles}
          activePage={activePage}
          onTitleChange={handleTitleChange}
          onPageContentChange={handlePageContentChange}
          onPageTitleChange={handlePageTitleChange}
          onAddPage={handleAddPage}
          onSelectPage={handleSelectPage}
          onDeletePage={handleDeletePage}
          onSaveDraft={handleSaveDraft}
          onPrimaryAction={handlePrimaryAction}
        />
      }
      metaPanel={
        <UserTextEditMetaPanel
          textId={id}
          language={language}
          type={type}
          author={author}
          sourceUrl={sourceUrl}
          description={description}
          coverPreviewUrl={coverPreviewUrl}
          genreId={genreId}
          isSaving={isSaving}
          onLanguageChange={handleLanguageChange}
          onTypeChange={handleTypeChange}
          onAuthorChange={handleAuthorChange}
          onSourceChange={handleSourceChange}
          onDescriptionChange={handleDescriptionChange}
          onCoverSelect={handleCoverSelect}
          onCoverRemove={handleCoverRemove}
          onGenreChange={handleGenreChange}
          onSaveDraft={handleSaveDraft}
          onPrimaryAction={handlePrimaryAction}
          primaryLabel={isSaving ? t("myTexts.autoSave.saving") : t("myTexts.save")}
        />
      }
    />
  );
};

// Loading skeleton matching editor layout
const EditorPageSkeleton = () => (
  <div className="flex h-screen flex-col overflow-hidden">
    <div className="h-[52px] shrink-0 animate-pulse border-b border-bd-1 bg-surf-2" />
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 bg-surf p-10">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-8 w-2/3 animate-pulse rounded bg-surf-3" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`h-4 animate-pulse rounded bg-surf-3 ${i % 4 === 3 ? "w-1/2" : "w-full"}`} />
          ))}
        </div>
      </div>
      <div className="hidden w-[248px] shrink-0 border-l border-bd-1 bg-surf p-4 min-[768px]:block">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-surf-3" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

interface UserTextEditPageProps {
  id: string;
  lang: string;
}

export const UserTextEditPage = ({ id, lang }: UserTextEditPageProps) => {
  const [isMetaPanelVisible, setIsMetaPanelVisible] = useState(true);
  const handleToggleMetaPanel = () => setIsMetaPanelVisible(v => !v);

  return (
    <ErrorBoundary fallback={<EditorPageSkeleton />}>
      <Suspense fallback={<EditorPageSkeleton />}>
        <UserTextEditPageInner
          id={id}
          lang={lang}
          isMetaPanelVisible={isMetaPanelVisible}
          onToggleMetaPanel={handleToggleMetaPanel}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
