"use client";

import { Save, Send } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { AdminTextTopbarShell } from "@/shared/ui/admin-text-editor";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";

interface UserTextEditTopbarProps {
  title: string;
  isUnsaved: boolean;
  isSaving: boolean;
  isMetaPanelVisible: boolean;
  mode: "create" | "edit";
  onSaveDraft: () => void;
  onPrimaryAction: () => void;
  onToggleMetaPanel: () => void;
  onSubmitForReview?: () => void;
  // Optional overrides
  primaryLabel?: string;
  primaryIcon?: React.ReactNode;
  saveDraftLabel?: string;
  backHref?: string;
  backLabel?: string;
}

export const UserTextEditTopbar = ({
  title,
  isUnsaved,
  isSaving,
  isMetaPanelVisible,
  mode,
  onSaveDraft,
  onPrimaryAction,
  onToggleMetaPanel,
  onSubmitForReview,
  primaryLabel,
  primaryIcon,
  saveDraftLabel,
  backHref,
  backLabel,
}: UserTextEditTopbarProps) => {
  const { t, lang } = useI18n();

  const statusLabel = isSaving
    ? t("myTexts.autoSave.saving")
    : isUnsaved
      ? t("myTexts.edit")
      : t("myTexts.autoSave.saved");

  const defaultPrimaryLabel = mode === "edit" ? t("myTexts.save") : t("myTexts.create");
  const resolvedPrimaryLabel = primaryLabel ?? (isSaving ? t("myTexts.autoSave.saving") : defaultPrimaryLabel);
  const resolvedSaveDraftLabel = saveDraftLabel ?? t("myTexts.submit.saveDraft");
  const resolvedBackHref = backHref ?? `/${lang}/my-texts`;
  const resolvedBackLabel = backLabel ?? t("myTexts.title");

  const submitButton = onSubmitForReview ? (
    <Button
      onClick={onSubmitForReview}
      disabled={isSaving}
      className="flex h-[30px] items-center gap-1.5 rounded-base border border-bd-2 bg-transparent px-3 text-xs text-t-2 transition-colors hover:border-bd-3 hover:bg-surf-2 hover:text-t-1 disabled:cursor-not-allowed disabled:opacity-50 max-[767px]:h-8 max-[767px]:w-8 max-[767px]:justify-center max-[767px]:gap-0 max-[767px]:px-0"
    >
      <Send className="size-3" />
      <Typography tag="span" className="max-[767px]:hidden">
        {t("myTexts.submit.sendToModeration")}
      </Typography>
    </Button>
  ) : null;

  return (
    <AdminTextTopbarShell
      breadcrumbTitle={title || (mode === "create" ? t("myTexts.create") : t("myTexts.edit"))}
      backAriaLabel={t("common.back")}
      settingsAriaLabel={t("myTexts.fields.title")}
      settingsLabel={t("myTexts.fields.title")}
      saveDraftAriaLabel={resolvedSaveDraftLabel}
      saveDraftLabel={resolvedSaveDraftLabel}
      primaryActionAriaLabel={resolvedPrimaryLabel}
      primaryActionLabel={resolvedPrimaryLabel}
      primaryActionIcon={primaryIcon ?? <Save className="size-3" />}
      isSaving={isSaving}
      isMetaPanelVisible={isMetaPanelVisible}
      statusLabel={statusLabel}
      showUnsavedPulse={isUnsaved}
      showSavedCheck={!isSaving && !isUnsaved}
      backHref={resolvedBackHref}
      backLabel={resolvedBackLabel}
      onSaveDraft={onSaveDraft}
      onPrimaryAction={onPrimaryAction}
      onToggleMetaPanel={onToggleMetaPanel}
      rightBeforeStatus={submitButton}
    />
  );
};
