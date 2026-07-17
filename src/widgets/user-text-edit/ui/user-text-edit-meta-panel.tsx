"use client";

import { Save } from "lucide-react";
import { useI18n } from "@/shared/lib/i18n";
import {
  AdminTextMetaPrimaryActionsSection,
  AdminTextMetaCoverSection,
  AdminTextMetaDescriptionSection,
} from "@/shared/ui/admin-text-editor";
import { MetaSection, FieldLabel, FieldInput, FieldSelect } from "@/shared/ui/admin-text-meta-fields";
import { ScriptVersionsPanel } from "@/features/reader-script";
import type { UserTextLanguage, UserTextType } from "@/entities/user-text";
import type { SubmissionLicenseType, SubmissionType } from "@/features/text-submission";
import { useGenres } from "@/entities/genre";
import { useVisibleLanguages } from "@/entities/user";
import { UserTextMobileMetaSheet } from "./user-text-mobile-meta-sheet";

const LICENSE_OPTIONS: { value: SubmissionLicenseType; label: string }[] = [
  { value: "PUBLIC_DOMAIN", label: "Дерриге а доьзна" },
  { value: "CC", label: "Creative Commons" },
  { value: "PERMISSION", label: "Авторан ирс дӀало" },
  { value: "UNKNOWN", label: "ХӀума ца хаъа" },
];

export interface UserTextEditMetaPanelProps {
  textId?: string;
  language: UserTextLanguage;
  type: UserTextType | SubmissionType;
  author: string;
  sourceUrl: string;
  isSaving: boolean;
  isBackgroundRunning?: boolean;
  onLanguageChange: (v: UserTextLanguage) => void;
  onTypeChange: (v: UserTextType | SubmissionType) => void;
  onAuthorChange: (v: string) => void;
  onSourceChange: (v: string) => void;
  onSaveDraft: () => void;
  onPrimaryAction: () => void;
  // Extended fields
  description?: string;
  coverPreviewUrl?: string | null;
  genreId?: string | null;
  onDescriptionChange?: (v: string) => void;
  onCoverSelect?: (file: File) => void;
  onCoverRemove?: () => void;
  onGenreChange?: (v: string | null) => void;
  // Submission-only fields
  licenseType?: SubmissionLicenseType | "";
  publicationYear?: string;
  licenseTypeError?: string;
  onLicenseTypeChange?: (v: SubmissionLicenseType | "") => void;
  onPublicationYearChange?: (v: string) => void;
  // Labels override
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryIcon?: React.ReactNode;
}

export const UserTextEditMetaPanel = ({
  textId,
  language, type, author, sourceUrl, isSaving, isBackgroundRunning = false,
  onLanguageChange, onTypeChange, onAuthorChange, onSourceChange,
  onSaveDraft, onPrimaryAction,
  description, coverPreviewUrl, genreId,
  onDescriptionChange, onCoverSelect, onCoverRemove, onGenreChange,
  licenseType, publicationYear, licenseTypeError,
  onLicenseTypeChange, onPublicationYearChange,
  primaryLabel, secondaryLabel, primaryIcon,
}: UserTextEditMetaPanelProps) => {
  const { t } = useI18n();
  const { data: genres = [] } = useGenres();
  const visibleLanguages = useVisibleLanguages();

  const languageOptions: { value: UserTextLanguage; label: string }[] = visibleLanguages.map((lang) => ({
    value: lang.code,
    label: t(`myTexts.fields.languageOptions.${lang.code.toLowerCase()}`),
  }));

  const isOriginal = type === "ORIGINAL";
  const isExternal = type === "EXTERNAL";
  const hasSubmissionFields = onLicenseTypeChange !== undefined;
  const hasCover = onCoverSelect !== undefined;
  const hasDescription = onDescriptionChange !== undefined;
  const hasGenre = onGenreChange !== undefined;

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
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onGenreChange?.(e.currentTarget.value || null);

  const resolvedPrimaryLabel = primaryLabel ?? (isSaving ? t("myTexts.autoSave.saving") : t("myTexts.create"));
  const resolvedSecondaryLabel = secondaryLabel ?? (isSaving ? t("myTexts.autoSave.saving") : t("myTexts.submit.saveDraft"));
  const resolvedPrimaryIcon = primaryIcon ?? <Save className="size-[13px]" />;

  const TYPE_OPTIONS: { value: UserTextType | SubmissionType; label: string }[] = [
    { value: "EXTERNAL", label: t("myTexts.type.external") },
    { value: "ORIGINAL", label: t("myTexts.type.original") },
  ];

  const fields = (
    <div className="flex flex-col gap-2">
      {/* Language */}
      <div>
        <FieldLabel>{t("myTexts.fields.language")}</FieldLabel>
        <FieldSelect value={language} onChange={handleLanguageChange}>
          {languageOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </FieldSelect>
      </div>

      {/* Type */}
      <div>
        <FieldLabel>{t("myTexts.fields.type")}</FieldLabel>
        <FieldSelect value={type} onChange={handleTypeChange}>
          {TYPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </FieldSelect>
      </div>

      {/* Author — hidden for ORIGINAL (derived server-side) */}
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

      {/* Source URL */}
      <div>
        <FieldLabel>
          {t("myTexts.fields.sourceUrl")}{" "}
          <span className="text-t-4">{t("myTexts.fields.optional")}</span>
        </FieldLabel>
        <FieldInput type="url" value={sourceUrl} onChange={handleSourceChange} placeholder="https://" />
      </div>

      {/* Genre */}
      {hasGenre && (
        <div>
          <FieldLabel>{t("admin.texts.createPage.genreLabel")}</FieldLabel>
          <FieldSelect value={genreId ?? ""} onChange={handleGenreChange}>
            <option value="">{t("admin.texts.createPage.genreNone")}</option>
            {genres.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </FieldSelect>
        </div>
      )}

      {/* License + year — submission EXTERNAL only */}
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
                <option key={opt.value} value={opt.value}>
                  {t(`myTexts.license.${opt.value === "PUBLIC_DOMAIN" ? "publicDomain" : opt.value.toLowerCase()}`)}
                </option>
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
  );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <div className="sticky top-[52px] hidden h-[calc(100vh-52px)] flex-col overflow-y-auto min-[768px]:flex">
        <MetaSection title={t("myTexts.fields.title")}>
          {fields}
        </MetaSection>

        {/* Description */}
        {hasDescription && (
          <AdminTextMetaDescriptionSection
            description={description ?? ""}
            sectionTitle={t("admin.texts.createPage.sections.description")}
            placeholder={t("admin.texts.createPage.descriptionPlaceholder")}
            onDescriptionChange={onDescriptionChange!}
          />
        )}

        {/* Cover */}
        {hasCover && (
          <AdminTextMetaCoverSection
            coverPreviewUrl={coverPreviewUrl ?? null}
            sectionTitle={t("admin.texts.createPage.sections.cover")}
            uploadLabel={t("admin.texts.createPage.coverUploadLabel")}
            uploadSub={t("admin.texts.createPage.coverUploadSub")}
            removeLabel={t("admin.texts.createPage.coverRemoveLabel")}
            onCoverSelect={onCoverSelect!}
            onCoverRemove={onCoverRemove}
          />
        )}

        {textId && <ScriptVersionsPanel textId={textId} isUserText />}

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

      {/* Mobile sheet */}
      <UserTextMobileMetaSheet
        language={language} languageOptions={languageOptions} type={type} author={author} sourceUrl={sourceUrl}
        isSaving={isSaving} onLanguageChange={onLanguageChange} onTypeChange={onTypeChange}
        onAuthorChange={onAuthorChange} onSourceChange={onSourceChange}
        onSaveDraft={onSaveDraft} onPrimaryAction={onPrimaryAction} t={t}
        licenseType={licenseType} publicationYear={publicationYear}
        licenseTypeError={licenseTypeError}
        onLicenseTypeChange={onLicenseTypeChange} onPublicationYearChange={onPublicationYearChange}
        primaryLabel={resolvedPrimaryLabel} secondaryLabel={resolvedSecondaryLabel}
        primaryIcon={resolvedPrimaryIcon} isBackgroundRunning={isBackgroundRunning}
        genreId={genreId} genres={genres} onGenreChange={onGenreChange}
        description={description} onDescriptionChange={onDescriptionChange}
      />
    </>
  );
};
