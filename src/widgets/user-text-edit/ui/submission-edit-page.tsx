"use client";

import { Suspense, useState } from "react";
import { Send } from "lucide-react";
import {
  AdminTextPageShell,
  AdminTextConfirmModal,
} from "@/shared/ui/admin-text-editor";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { useSubmissionEditor } from "@/features/my-texts/model/use-submission-editor";
import { UserTextEditTopbar } from "./user-text-edit-topbar";
import { UserTextEditEditor } from "./user-text-edit-editor";
import { UserTextEditMetaPanel } from "./user-text-edit-meta-panel";
import type { SubmissionLicenseType } from "@/features/text-submission";
import type { TipTapDoc } from "@/shared/ui/notion-editor";

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

interface SubmissionEditPageInnerProps {
  draftId: string;
  lang: string;
  isMetaPanelVisible: boolean;
  onToggleMetaPanel: () => void;
}

const SubmissionEditPageInner = ({
  draftId, lang, isMetaPanelVisible, onToggleMetaPanel,
}: SubmissionEditPageInnerProps) => {
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
  } = useSubmissionEditor({ mode: "edit", draftId, lang });

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
            mode="edit"
            onSaveDraft={handleSaveDraft}
            onPrimaryAction={handleRequestSubmit}
            onToggleMetaPanel={onToggleMetaPanel}
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

interface SubmissionEditPageProps {
  draftId: string;
  lang: string;
}

export const SubmissionEditPage = ({ draftId, lang }: SubmissionEditPageProps) => {
  const [isMetaPanelVisible, setIsMetaPanelVisible] = useState(true);
  const handleToggleMetaPanel = () => setIsMetaPanelVisible(v => !v);

  return (
    <ErrorBoundary fallback={<EditorPageSkeleton />}>
      <Suspense fallback={<EditorPageSkeleton />}>
        <SubmissionEditPageInner
          draftId={draftId}
          lang={lang}
          isMetaPanelVisible={isMetaPanelVisible}
          onToggleMetaPanel={handleToggleMetaPanel}
        />
      </Suspense>
    </ErrorBoundary>
  );
};
