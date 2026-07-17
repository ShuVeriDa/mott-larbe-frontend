"use client";

import { useState } from "react";
import { AlignLeft, ChevronDown, Save, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { AdminTextMetaPrimaryActionsSection } from "@/shared/ui/admin-text-editor";
import { MetaSection, FieldLabel, FieldInput, FieldSelect } from "@/shared/ui/admin-text-meta-fields";
import type { UserTextLanguage, UserTextType } from "@/entities/user-text";
import type { SubmissionLicenseType, SubmissionType } from "@/features/text-submission";

const TYPE_OPTIONS: { value: UserTextType | SubmissionType; label: string }[] = [
  { value: "EXTERNAL", label: "Кхечун текст" },
  { value: "ORIGINAL", label: "Шен произведени" },
];

const LICENSE_OPTIONS: { value: SubmissionLicenseType; label: string }[] = [
  { value: "PUBLIC_DOMAIN", label: "Дерриге а доьзна" },
  { value: "CC", label: "Creative Commons" },
  { value: "PERMISSION", label: "Авторан ирс дӀало" },
  { value: "UNKNOWN", label: "ХӀума ца хаъа" },
];

export interface UserTextMobileMetaSheetProps {
  language: UserTextLanguage;
  languageOptions: { value: UserTextLanguage; label: string }[];
  type: UserTextType | SubmissionType;
  author: string;
  sourceUrl: string;
  isSaving: boolean;
  onLanguageChange: (v: UserTextLanguage) => void;
  onTypeChange: (v: UserTextType | SubmissionType) => void;
  onAuthorChange: (v: string) => void;
  onSourceChange: (v: string) => void;
  onSaveDraft: () => void;
  onPrimaryAction: () => void;
  t: (key: string) => string;
  // Submission-only (optional)
  licenseType?: SubmissionLicenseType | "";
  publicationYear?: string;
  licenseTypeError?: string;
  onLicenseTypeChange?: (v: SubmissionLicenseType | "") => void;
  onPublicationYearChange?: (v: string) => void;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryIcon?: React.ReactNode;
  isBackgroundRunning?: boolean;
  // Extended fields (optional)
  genreId?: string | null;
  genres?: { id: string; name: string }[];
  onGenreChange?: (v: string | null) => void;
  description?: string;
  onDescriptionChange?: (v: string) => void;
}

export const UserTextMobileMetaSheet = ({
  language, languageOptions, type, author, sourceUrl, isSaving,
  onLanguageChange, onTypeChange, onAuthorChange, onSourceChange,
  onSaveDraft, onPrimaryAction, t,
  licenseType, publicationYear, licenseTypeError,
  onLicenseTypeChange, onPublicationYearChange,
  primaryLabel, secondaryLabel, primaryIcon, isBackgroundRunning = false,
  genreId, genres = [], onGenreChange,
  description, onDescriptionChange,
}: UserTextMobileMetaSheetProps) => {
  const [metaOpen, setMetaOpen] = useState(false);
  const isOriginal = type === "ORIGINAL";
  const isExternal = type === "EXTERNAL";
  const hasSubmissionFields = onLicenseTypeChange !== undefined;
  const hasGenre = onGenreChange !== undefined;
  const hasDescription = onDescriptionChange !== undefined;

  const handleToggle = () => setMetaOpen(v => !v);
  const handleClose = () => setMetaOpen(false);
  const handleOverlayClick = () => setMetaOpen(false);
  const handleSheetClick = (e: React.MouseEvent) => e.stopPropagation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onLanguageChange(e.currentTarget.value as UserTextLanguage);
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onTypeChange(e.currentTarget.value as UserTextType);
  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onAuthorChange(e.currentTarget.value);
  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onSourceChange(e.currentTarget.value);
  const handleLicenseChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onLicenseTypeChange?.(e.currentTarget.value as SubmissionLicenseType);
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onPublicationYearChange?.(e.currentTarget.value);

  const resolvedPrimaryLabel = primaryLabel ?? (isSaving ? t("myTexts.autoSave.saving") : t("myTexts.create"));
  const resolvedSecondaryLabel = secondaryLabel ?? (isSaving ? t("myTexts.autoSave.saving") : t("myTexts.submit.saveDraft"));
  const resolvedPrimaryIcon = primaryIcon ?? <Save className="size-[13px]" />;

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        className="fixed right-4 bottom-12 z-[205] flex items-center gap-1.5 rounded-base border border-bd-2 bg-surf/95 px-3.5 py-1.5 text-[12px] font-medium text-t-2 shadow-sm backdrop-blur min-[768px]:hidden"
      >
        <AlignLeft className="size-3.5" />
        {t("myTexts.fields.title")}
        <ChevronDown className="size-3 text-t-4" />
      </button>

      {metaOpen && (
        <div
          className="fixed inset-0 z-[210] flex items-end bg-black/35 backdrop-blur-[2px] min-[768px]:hidden"
          onClick={handleOverlayClick}
        >
          <div
            className="flex max-h-[82vh] w-full flex-col rounded-t-2xl border-t border-bd-1 bg-surf"
            onClick={handleSheetClick}
          >
            <div className="flex items-center justify-between border-b border-bd-1 px-4 py-3">
              <Typography tag="span" className="text-[13px] font-semibold text-t-1">
                {t("myTexts.fields.title")}
              </Typography>
              <Button type="button" variant="ghost" className="h-7 w-7 p-0" onClick={handleClose}>
                <X className="size-4" />
              </Button>
            </div>

            <div className="overflow-y-auto pb-4">
              <MetaSection title={t("myTexts.fields.title")}>
                <div className="flex flex-col gap-2">
                  <div>
                    <FieldLabel>{t("myTexts.fields.language")}</FieldLabel>
                    <FieldSelect value={language} onChange={handleLanguageChange}>
                      {languageOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </FieldSelect>
                  </div>
                  <div>
                    <FieldLabel>{t("myTexts.fields.type")}</FieldLabel>
                    <FieldSelect value={type} onChange={handleTypeChange}>
                      {TYPE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </FieldSelect>
                  </div>
                  {!isOriginal && (
                    <div>
                      <FieldLabel>{t("myTexts.fields.author")}</FieldLabel>
                      <FieldInput
                        value={author}
                        onChange={handleAuthorChange}
                        placeholder={t("myTexts.fields.authorPlaceholder")}
                        maxLength={300}
                      />
                    </div>
                  )}
                  <div>
                    <FieldLabel>{t("myTexts.fields.sourceUrl")}</FieldLabel>
                    <FieldInput type="url" value={sourceUrl} onChange={handleSourceChange} placeholder="https://" />
                  </div>
                  {hasGenre && (
                    <div>
                      <FieldLabel>{t("admin.texts.createPage.genreLabel")}</FieldLabel>
                      <FieldSelect value={genreId ?? ""} onChange={e => onGenreChange?.(e.currentTarget.value || null)}>
                        <option value="">{t("admin.texts.createPage.genreNone")}</option>
                        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </FieldSelect>
                    </div>
                  )}
                  {hasDescription && (
                    <div>
                      <FieldLabel>{t("admin.texts.createPage.sections.description")}</FieldLabel>
                      <textarea
                        value={description ?? ""}
                        onChange={e => onDescriptionChange?.(e.currentTarget.value)}
                        placeholder={t("admin.texts.createPage.descriptionPlaceholder")}
                        rows={3}
                        className="w-full resize-none rounded-base border border-bd-2 bg-surf-2 px-2.5 py-1.5 text-[12px] text-t-1 outline-none focus:border-acc placeholder:text-t-4"
                      />
                    </div>
                  )}
                  {hasSubmissionFields && isExternal && (
                    <>
                      <div>
                        <FieldLabel>
                          {t("myTexts.fields.licenseType")}
                          {licenseTypeError && (
                            <span className="ml-1 text-[11px] text-red-500">{licenseTypeError}</span>
                          )}
                        </FieldLabel>
                        <FieldSelect value={licenseType ?? ""} onChange={handleLicenseChange}>
                          <option value="">{t("myTexts.fields.licenseTypePlaceholder")}</option>
                          {LICENSE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </FieldSelect>
                      </div>
                      <div>
                        <FieldLabel>
                          {t("myTexts.fields.publicationYear")}{" "}
                          <span className="text-t-4">{t("myTexts.fields.optional")}</span>
                        </FieldLabel>
                        <FieldInput
                          type="number"
                          min={1000}
                          max={new Date().getFullYear()}
                          value={publicationYear ?? ""}
                          onChange={handleYearChange}
                          placeholder={String(new Date().getFullYear())}
                          className="w-32"
                        />
                      </div>
                    </>
                  )}
                </div>
              </MetaSection>

              <AdminTextMetaPrimaryActionsSection
                isSaving={isSaving}
                isBackgroundRunning={isBackgroundRunning}
                primaryLabel={resolvedPrimaryLabel}
                secondaryLabel={resolvedSecondaryLabel}
                primaryIcon={resolvedPrimaryIcon}
                secondaryIcon={<Save className="size-3" />}
                onPrimaryAction={onPrimaryAction}
                onSecondaryAction={onSaveDraft}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
