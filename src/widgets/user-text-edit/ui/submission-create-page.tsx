"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import {
  AdminTextPageShell,
  AdminTextConfirmModal,
} from "@/shared/ui/admin-text-editor";
import { useSubmissionEditor } from "@/features/my-texts/model/use-submission-editor";
import { UserTextEditTopbar } from "./user-text-edit-topbar";
import { UserTextEditEditor } from "./user-text-edit-editor";
import { UserTextEditMetaPanel } from "./user-text-edit-meta-panel";
import type { SubmissionLicenseType } from "@/features/text-submission";
import type { TipTapDoc } from "@/shared/ui/notion-editor";

interface SubmissionCreatePageProps {
  lang: string;
}

export const SubmissionCreatePage = ({ lang }: SubmissionCreatePageProps) => {
  const [isMetaPanelVisible, setIsMetaPanelVisible] = useState(true);
  const handleToggleMetaPanel = () => setIsMetaPanelVisible(v => !v);

  const {
    t,
    title, language, submissionType, author, sourceUrl,
    licenseType, publicationYear, contentRich,
    fieldErrors, isPending, showSubmitConfirm,
    description, genreId, coverPreviewUrl, pageTitles,
    handleTitleChange, handleLanguageChange, handleSubmissionTypeChange,
    handleAuthorChange, handleSourceUrlChange,
    handleLicenseTypeChange, handlePublicationYearChange,
    handleContentUpdate, handlePageTitleChange,
    handleDescriptionChange, handleGenreChange, handleCoverSelect, handleCoverRemove,
    handleSaveDraft, handleRequestSubmit,
    handleConfirmSubmit, handleCancelSubmit,
  } = useSubmissionEditor({ mode: "create", lang });

  const handleTitleDirect = (value: string) =>
    handleTitleChange({ currentTarget: { value } } as React.ChangeEvent<HTMLInputElement>);

  const handlePageContentChange = (doc: TipTapDoc) => handleContentUpdate(doc);

  const handleLanguageDirect = (v: string) =>
    handleLanguageChange({ currentTarget: { value: v } } as React.ChangeEvent<HTMLSelectElement>);

  const handleTypeDirect = (v: string) =>
    handleSubmissionTypeChange({ currentTarget: { value: v } } as React.ChangeEvent<HTMLSelectElement>);

  const handleAuthorDirect = (v: string) =>
    handleAuthorChange({ currentTarget: { value: v } } as React.ChangeEvent<HTMLInputElement>);

  const handleSourceDirect = (v: string) =>
    handleSourceUrlChange({ currentTarget: { value: v } } as React.ChangeEvent<HTMLInputElement>);

  const handleLicenseDirect = (v: SubmissionLicenseType | "") =>
    handleLicenseTypeChange({ currentTarget: { value: v } } as React.ChangeEvent<HTMLSelectElement>);

  const handleYearDirect = (v: string) =>
    handlePublicationYearChange({ currentTarget: { value: v } } as React.ChangeEvent<HTMLInputElement>);

  return (
    <>
      <AdminTextPageShell
        isMetaPanelVisible={isMetaPanelVisible}
        topbar={
          <UserTextEditTopbar
            title={title}
            isUnsaved={false}
            isSaving={isPending}
            isMetaPanelVisible={isMetaPanelVisible}
            mode="create"
            onSaveDraft={handleSaveDraft}
            onPrimaryAction={handleRequestSubmit}
            onToggleMetaPanel={handleToggleMetaPanel}
            primaryLabel={isPending ? t("myTexts.autoSave.saving") : t("myTexts.submit.sendToModeration")}
            primaryIcon={<Send className="size-3" />}
            saveDraftLabel={t("myTexts.submit.saveDraft")}
          />
        }
        editor={
          <UserTextEditEditor
            title={title}
            pages={[{ doc: contentRich }]}
            pageTitles={pageTitles}
            activePage={0}
            onTitleChange={handleTitleDirect}
            onPageContentChange={handlePageContentChange}
            onPageTitleChange={handlePageTitleChange}
            onAddPage={() => undefined}
            onSelectPage={() => undefined}
            onDeletePage={() => undefined}
            onSaveDraft={handleSaveDraft}
            onPrimaryAction={handleRequestSubmit}
          />
        }
        metaPanel={
          <UserTextEditMetaPanel
            language={language as never}
            type={submissionType}
            author={author}
            sourceUrl={sourceUrl}
            description={description}
            coverPreviewUrl={coverPreviewUrl}
            genreId={genreId}
            isSaving={isPending}
            licenseType={licenseType}
            publicationYear={publicationYear}
            licenseTypeError={fieldErrors.licenseType}
            onLanguageChange={handleLanguageDirect as never}
            onTypeChange={handleTypeDirect}
            onAuthorChange={handleAuthorDirect}
            onSourceChange={handleSourceDirect}
            onLicenseTypeChange={handleLicenseDirect}
            onPublicationYearChange={handleYearDirect}
            onDescriptionChange={handleDescriptionChange}
            onCoverSelect={handleCoverSelect}
            onCoverRemove={handleCoverRemove}
            onGenreChange={handleGenreChange}
            onSaveDraft={handleSaveDraft}
            onPrimaryAction={handleRequestSubmit}
            primaryLabel={isPending ? t("myTexts.autoSave.saving") : t("myTexts.submit.sendToModeration")}
            secondaryLabel={t("myTexts.submit.saveDraft")}
            primaryIcon={<Send className="size-[13px]" />}
          />
        }
      />

      {showSubmitConfirm && (
        <AdminTextConfirmModal
          title={t("myTexts.submit.confirmTitle")}
          description={t("myTexts.submit.confirmBody")}
          confirmLabel={t("myTexts.submit.sendToModeration")}
          cancelLabel={t("myTexts.cancel")}
          onConfirm={handleConfirmSubmit}
          onCancel={handleCancelSubmit}
        />
      )}
    </>
  );
};
