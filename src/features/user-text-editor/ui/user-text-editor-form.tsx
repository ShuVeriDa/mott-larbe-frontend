"use client";

import { NotionEditor } from "@/shared/ui/notion-editor";
import { Typography } from "@/shared/ui/typography";
import { UserTextMetaFields } from "./user-text-meta-fields";
import { UserTextEditorSubmitButton } from "./user-text-editor-submit-button";
import { useUserTextEditor, type UseUserTextEditorProps } from "../model/use-user-text-editor";

// NotionEditor is a heavy bundle — this component is only imported on editor routes.
// Do NOT re-export from a barrel shared with list/reader routes.

interface UserTextEditorFormProps extends UseUserTextEditorProps {}

export const UserTextEditorForm = (props: UserTextEditorFormProps) => {
  const {
    t,
    title,
    language,
    type,
    author,
    sourceUrl,
    content,
    fieldErrors,
    isContentTooLarge,
    autoSaveStatus,
    isPending,
    handleTitleChange,
    handleLanguageChange,
    handleTypeChange,
    handleAuthorChange,
    handleSourceUrlChange,
    handleContentUpdate,
    handleSubmit,
  } = useUserTextEditor(props);

  // React 19: useActionState not used here because the submit calls
  // TanStack Query mutations (not a Server Action). Instead the hook
  // manages state internally — isPending comes from useMutation.
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="flex h-full flex-col overflow-hidden"
    >
      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-bd-1 bg-surf px-[22px] py-3 max-sm:px-4">
        <h1 className="text-[13.5px] font-semibold text-t-1">
          {props.mode === "create"
            ? t("myTexts.create")
            : t("myTexts.edit")}
        </h1>

        {/* Auto-save indicator (edit mode only) */}
        {props.mode === "edit" && autoSaveStatus !== "idle" && (
          <Typography tag="span" className="text-[11.5px] text-t-3">
            {autoSaveStatus === "saving" && t("myTexts.autoSave.saving")}
            {autoSaveStatus === "saved" && t("myTexts.autoSave.saved")}
            {autoSaveStatus === "error" && (
              <span className="text-red-500">{t("myTexts.autoSave.error")}</span>
            )}
          </Typography>
        )}

        <UserTextEditorSubmitButton
          label={
            props.mode === "create"
              ? t("myTexts.create")
              : t("myTexts.edit")
          }
          pendingLabel={t("myTexts.saving")}
        />
      </div>

      {/* Body — two-column on desktop, stacked on mobile */}
      <div className="flex flex-1 flex-col gap-0 overflow-hidden lg:flex-row">
        {/* Left: meta fields */}
        <div className="shrink-0 overflow-y-auto border-b border-bd-1 bg-surf p-4 lg:w-[280px] lg:border-b-0 lg:border-r">
          <UserTextMetaFields
            title={title}
            language={language}
            type={type}
            author={author}
            sourceUrl={sourceUrl}
            titleError={fieldErrors.title}
            sourceUrlError={fieldErrors.sourceUrl}
            onTitleChange={handleTitleChange}
            onLanguageChange={handleLanguageChange}
            onTypeChange={handleTypeChange}
            onAuthorChange={handleAuthorChange}
            onSourceUrlChange={handleSourceUrlChange}
            t={t}
          />
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

          {fieldErrors.content && (
            <div className="shrink-0 px-4 py-1">
              <Typography tag="p" className="text-[11.5px] text-red-500">
                {fieldErrors.content}
              </Typography>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <NotionEditor
              content={content}
              onUpdate={handleContentUpdate}
              slashMenuItems={[]}
              placeholder={t("myTexts.editor.placeholder")}
              minHeight="100%"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
