"use client";

import { useState } from "react";
import { AdminTextPageShell } from "@/shared/ui/admin-text-editor";
import { NeedsGeminiKeyCta } from "@/features/generate-user-text";
import { useUserTextCreatePage } from "../model/use-user-text-edit-page";
import { UserTextEditTopbar } from "./user-text-edit-topbar";
import { UserTextEditEditor } from "./user-text-edit-editor";
import { UserTextEditMetaPanel } from "./user-text-edit-meta-panel";

interface UserTextCreatePageProps {
  lang: string;
}

export const UserTextCreatePage = ({ lang }: UserTextCreatePageProps) => {
  const [isMetaPanelVisible, setIsMetaPanelVisible] = useState(true);
  const handleToggleMetaPanel = () => setIsMetaPanelVisible(v => !v);
  const [isGeminiKeyCtaOpen, setIsGeminiKeyCtaOpen] = useState(false);

  const {
    title, language, type, author, sourceUrl,
    description, coverPreviewUrl, genreId,
    pages, pageTitles, activePage, isUnsaved, isSaving, isBackgroundRunning, editorMode,
    handleTitleChange, handleLanguageChange, handleTypeChange,
    handleAuthorChange, handleSourceChange,
    handleDescriptionChange, handleGenreChange, handleCoverSelect, handleCoverRemove,
    handlePageContentChange, handlePageTitleChange, handleEditorModeChange, handleGenerated,
    handleAddPage, handleSelectPage, handleDeletePage,
    handleSaveDraft, handlePrimaryAction, handleSubmitForReview,
  } = useUserTextCreatePage(lang);

  const handleNeedsGeminiKey = () => setIsGeminiKeyCtaOpen(true);
  const handleCloseGeminiKeyCta = () => setIsGeminiKeyCtaOpen(false);

  return (
    <AdminTextPageShell
      isMetaPanelVisible={isMetaPanelVisible}
      topbar={
        <UserTextEditTopbar
          title={title}
          isUnsaved={isUnsaved}
          isSaving={isSaving}
          isBackgroundRunning={isBackgroundRunning}
          isMetaPanelVisible={isMetaPanelVisible}
          mode="create"
          onSaveDraft={handleSaveDraft}
          onPrimaryAction={handlePrimaryAction}
          onToggleMetaPanel={handleToggleMetaPanel}
          onSubmitForReview={handleSubmitForReview}
        />
      }
      editor={
        <UserTextEditEditor
          title={title}
          language={language}
          pages={pages}
          pageTitles={pageTitles}
          activePage={activePage}
          showSpellingAdd
          editorMode={editorMode}
          onTitleChange={handleTitleChange}
          onPageContentChange={handlePageContentChange}
          onPageTitleChange={handlePageTitleChange}
          onAddPage={handleAddPage}
          onSelectPage={handleSelectPage}
          onDeletePage={handleDeletePage}
          onSaveDraft={handleSaveDraft}
          onPrimaryAction={handlePrimaryAction}
          onEditorModeChange={handleEditorModeChange}
          onGenerated={handleGenerated}
          onNeedsGeminiKey={handleNeedsGeminiKey}
        />
      }
      metaPanel={
        <UserTextEditMetaPanel
          language={language}
          type={type}
          author={author}
          sourceUrl={sourceUrl}
          description={description}
          coverPreviewUrl={coverPreviewUrl}
          genreId={genreId}
          isSaving={isSaving}
          isBackgroundRunning={isBackgroundRunning}
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
        />
      }
      bottomSlot={<NeedsGeminiKeyCta open={isGeminiKeyCtaOpen} onClose={handleCloseGeminiKeyCta} />}
    />
  );
};
