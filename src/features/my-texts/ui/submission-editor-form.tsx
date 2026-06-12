"use client";

import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { Typography } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { NotionEditor } from "@/shared/ui/notion-editor";
import { SubmissionLicenseFields } from "./submission-license-fields";
import { SubmissionSubmitButton } from "./submission-submit-button";
import { CopyFromUserTextPicker } from "./copy-from-user-text-picker";
import {
  useSubmissionEditor,
  type UseSubmissionEditorProps,
} from "../model/use-submission-editor";
import { getSubmissionTypeOptions } from "../lib/get-submission-type-options";
import type { CreateTextSubmissionDto } from "@/features/text-submission";
import type { TipTapDoc } from "@/shared/ui/notion-editor";

interface SubmissionEditorFormProps extends UseSubmissionEditorProps {}

export const SubmissionEditorForm = (props: SubmissionEditorFormProps) => {
  const {
    t,
    title,
    language,
    submissionType,
    author,
    sourceUrl,
    licenseType,
    publicationYear,
    contentRich,
    fieldErrors,
    isExternal,
    isContentTooLarge,
    autoSaveStatus,
    showSubmitConfirm,
    isPending,
    isLoadingDraft,
    mode,
    handleTitleChange,
    handleLanguageChange,
    handleSubmissionTypeChange,
    handleAuthorChange,
    handleSourceUrlChange,
    handleLicenseTypeChange,
    handlePublicationYearChange,
    handleContentUpdate,
    handleSaveDraft,
    handleRequestSubmit,
    handleConfirmSubmit,
    handleCancelSubmit,
  } = useSubmissionEditor(props);

  const typeOptions = getSubmissionTypeOptions(t);

  // Called when user copies from their private library (CopyFromUserTextPicker)
  const handleCopied = (dto: CreateTextSubmissionDto, richContent: TipTapDoc) => {
    handleTitleChange({
      currentTarget: { value: dto.title },
    } as React.ChangeEvent<HTMLInputElement>);
    handleContentUpdate(richContent);
  };

  if (isLoadingDraft) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-pulse rounded-full bg-surf-3" />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-full flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-bd-1 bg-surf px-[22px] py-3 max-sm:px-4">
          <h1 className="text-[13.5px] font-semibold text-t-1">
            {mode === "create"
              ? t("myTexts.submit.createTitle")
              : t("myTexts.submit.editTitle")}
          </h1>

          <div className="flex items-center gap-3">
            {/* Auto-save indicator */}
            {mode === "edit" && autoSaveStatus !== "idle" && (
              <Typography tag="span" className="text-[11.5px] text-t-3">
                {autoSaveStatus === "saving" && t("myTexts.autoSave.saving")}
                {autoSaveStatus === "saved" && t("myTexts.autoSave.saved")}
                {autoSaveStatus === "error" && (
                  <span className="text-red-500">{t("myTexts.autoSave.error")}</span>
                )}
              </Typography>
            )}

            {/* Copy from my private library */}
            {mode === "create" && (
              <CopyFromUserTextPicker onCopied={handleCopied} t={t} />
            )}

            <SubmissionSubmitButton
              isPending={isPending}
              onSaveDraft={handleSaveDraft}
              onRequestSubmit={handleRequestSubmit}
              t={t}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-0 overflow-hidden lg:flex-row">
          {/* Left: meta fields */}
          <div className="shrink-0 overflow-y-auto border-b border-bd-1 bg-surf p-4 lg:w-[280px] lg:border-b-0 lg:border-r">
            <div className="flex flex-col gap-3">
              {/* Title */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="sub-title" className="text-[12px] font-medium text-t-2">
                  {t("myTexts.fields.title")}
                </Label>
                <Input
                  id="sub-title"
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder={t("myTexts.fields.titlePlaceholder")}
                  maxLength={500}
                />
                {fieldErrors.title && (
                  <Typography tag="p" className="text-[11.5px] text-red-500">
                    {fieldErrors.title}
                  </Typography>
                )}
              </div>

              {/* Submission type */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="sub-type" className="text-[12px] font-medium text-t-2">
                  {t("myTexts.fields.type")}
                </Label>
                <Select
                  id="sub-type"
                  variant="lg"
                  value={submissionType}
                  onChange={handleSubmissionTypeChange}
                >
                  {typeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Language */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="sub-language" className="text-[12px] font-medium text-t-2">
                  {t("myTexts.fields.language")}
                </Label>
                <Select
                  id="sub-language"
                  variant="lg"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  {["CHE", "RU", "AR", "EN"].map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </Select>
              </div>

              {/* Author — hidden for ORIGINAL */}
              {submissionType !== "ORIGINAL" && (
                <div className="flex flex-col gap-1">
                  <Label htmlFor="sub-author" className="text-[12px] font-medium text-t-2">
                    {t("myTexts.fields.author")}
                  </Label>
                  <Input
                    id="sub-author"
                    type="text"
                    value={author}
                    onChange={handleAuthorChange}
                    maxLength={300}
                  />
                </div>
              )}

              {/* Source URL */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="sub-source" className="text-[12px] font-medium text-t-2">
                  {t("myTexts.fields.sourceUrl")}
                  <span className="ml-1 text-t-4">{t("myTexts.fields.optional")}</span>
                </Label>
                <Input
                  id="sub-source"
                  type="url"
                  value={sourceUrl}
                  onChange={handleSourceUrlChange}
                  placeholder="https://"
                />
                {fieldErrors.sourceUrl && (
                  <Typography tag="p" className="text-[11.5px] text-red-500">
                    {fieldErrors.sourceUrl}
                  </Typography>
                )}
              </div>

              {/* License fields — EXTERNAL only */}
              {isExternal && (
                <SubmissionLicenseFields
                  licenseType={licenseType}
                  publicationYear={publicationYear}
                  licenseTypeError={fieldErrors.licenseType}
                  onLicenseTypeChange={handleLicenseTypeChange}
                  onPublicationYearChange={handlePublicationYearChange}
                  t={t}
                />
              )}
            </div>
          </div>

          {/* Right: TipTap editor */}
          <div className="flex flex-1 flex-col overflow-hidden bg-surf">
            {isContentTooLarge && (
              <div className="shrink-0 bg-yellow-50 px-4 py-2 dark:bg-yellow-900/20">
                <Typography tag="p" className="text-[11.5px] text-yellow-800 dark:text-yellow-400">
                  {t("myTexts.validation.contentTooLarge")}
                </Typography>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <NotionEditor
                content={contentRich}
                onUpdate={handleContentUpdate}
                slashMenuItems={[]}
                placeholder={t("myTexts.editor.placeholder")}
                minHeight="100%"
                showStressMark
              />
            </div>
          </div>
        </div>
      </div>

      {/* Submit confirmation dialog */}
      <Dialog open={showSubmitConfirm} onOpenChange={handleCancelSubmit}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[13.5px] font-semibold text-t-1">
              {t("myTexts.submit.confirmTitle")}
            </DialogTitle>
            <DialogDescription className="text-[12.5px] text-t-3">
              {t("myTexts.submit.confirmBody")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelSubmit}
              disabled={isPending}
            >
              {t("myTexts.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleConfirmSubmit}
              disabled={isPending}
            >
              {t("myTexts.submit.sendToModeration")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
