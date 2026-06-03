"use client";

import { Save } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import { AdminTextTopbarShell } from "@/shared/ui/admin-text-editor";

interface UserTextEditTopbarProps {
  title: string;
  isUnsaved: boolean;
  isSaving: boolean;
  isMetaPanelVisible: boolean;
  mode: "create" | "edit";
  onSaveDraft: () => void;
  onPrimaryAction: () => void;
  onToggleMetaPanel: () => void;
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

  const resolvedPrimaryLabel = primaryLabel ?? (isSaving ? t("myTexts.autoSave.saving") : t("myTexts.create"));
  const resolvedSaveDraftLabel = saveDraftLabel ?? t("myTexts.submit.saveDraft");
  const resolvedBackHref = backHref ?? `/${lang}/my-texts`;
  const resolvedBackLabel = backLabel ?? t("myTexts.title");

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
    />
  );
};
