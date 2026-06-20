"use client";

import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { Typography } from "@/shared/ui/typography";
import { getLanguageOptions } from "../lib/get-language-options";
import { getTypeOptions } from "../lib/get-type-options";
import type { UserTextLanguage, UserTextType } from "@/entities/user-text";

interface UserTextMetaFieldsProps {
  title: string;
  language: UserTextLanguage;
  type: UserTextType;
  author: string;
  sourceUrl: string;
  titleError?: string;
  sourceUrlError?: string;
  languageError?: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLanguageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAuthorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSourceUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
}

export const UserTextMetaFields = ({
  title,
  language,
  type,
  author,
  sourceUrl,
  titleError,
  sourceUrlError,
  languageError,
  onTitleChange,
  onLanguageChange,
  onTypeChange,
  onAuthorChange,
  onSourceUrlChange,
  t,
}: UserTextMetaFieldsProps) => {
  const languageOptions = getLanguageOptions(t);
  const typeOptions = getTypeOptions(t);
  const isOriginal = type === "ORIGINAL";

  return (
    <div className="flex flex-col gap-3">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="user-text-title" className="text-[12px] font-medium text-t-2">
          {t("myTexts.fields.title")}
        </Label>
        <Input
          id="user-text-title"
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder={t("myTexts.fields.titlePlaceholder")}
          maxLength={500}
        />
        {titleError && (
          <Typography tag="p" className="text-[11.5px] text-red-500">
            {titleError}
          </Typography>
        )}
      </div>

      {/* Type + Language row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label htmlFor="user-text-type" className="text-[12px] font-medium text-t-2">
            {t("myTexts.fields.type")}
          </Label>
          <Select
            id="user-text-type"
            variant="lg"
            value={type}
            onChange={onTypeChange}
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="user-text-language" className="text-[12px] font-medium text-t-2">
            {t("myTexts.fields.language")}
          </Label>
          <Select
            id="user-text-language"
            variant="lg"
            value={language}
            onChange={onLanguageChange}
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          {languageError && (
            <Typography tag="p" className="text-[11.5px] text-red-500">
              {languageError}
            </Typography>
          )}
        </div>
      </div>

      {/* Author — hidden for ORIGINAL (derived server-side per C3) */}
      {!isOriginal && (
        <div className="flex flex-col gap-1">
          <Label htmlFor="user-text-author" className="text-[12px] font-medium text-t-2">
            {t("myTexts.fields.author")}
          </Label>
          <Input
            id="user-text-author"
            type="text"
            value={author}
            onChange={onAuthorChange}
            placeholder={t("myTexts.fields.authorPlaceholder")}
            maxLength={300}
          />
        </div>
      )}

      {/* Source URL */}
      <div className="flex flex-col gap-1">
        <Label htmlFor="user-text-source" className="text-[12px] font-medium text-t-2">
          {t("myTexts.fields.sourceUrl")}
          <span className="ml-1 text-t-4">{t("myTexts.fields.optional")}</span>
        </Label>
        <Input
          id="user-text-source"
          type="url"
          value={sourceUrl}
          onChange={onSourceUrlChange}
          placeholder="https://"
        />
        {sourceUrlError && (
          <Typography tag="p" className="text-[11.5px] text-red-500">
            {sourceUrlError}
          </Typography>
        )}
      </div>
    </div>
  );
};
