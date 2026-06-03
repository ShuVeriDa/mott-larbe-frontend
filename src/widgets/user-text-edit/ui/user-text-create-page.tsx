"use client";

import { useState } from "react";
import { AdminTextPageShell } from "@/shared/ui/admin-text-editor";
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

  const {
    t, title, language, type, author, sourceUrl,
    description, coverPreviewUrl, genreId,
    pages, pageTitles, activePage, isUnsaved, isSaving,
    handleTitleChange, handleLanguageChange, handleTypeChange,
    handleAuthorChange, handleSourceChange,
    handleDescriptionChange, handleGenreChange, handleCoverSelect, handleCoverRemove,
    handlePageContentChange, handlePageTitleChange,
    handleAddPage, handleSelectPage, handleDeletePage,
    handleSaveDraft, handlePrimaryAction,
  } = useUserTextCreatePage(lang);

  return (
    <AdminTextPageShell
      isMetaPanelVisible={isMetaPanelVisible}
      topbar={
        <UserTextEditTopbar
          title={title}
          isUnsaved={isUnsaved}
          isSaving={isSaving}
          isMetaPanelVisible={isMetaPanelVisible}
          mode="create"
          onSaveDraft={handleSaveDraft}
          onPrimaryAction={handlePrimaryAction}
          onToggleMetaPanel={handleToggleMetaPanel}
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
        />
      }
    />
  );
};
