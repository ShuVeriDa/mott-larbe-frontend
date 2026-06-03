import type { UserTextLanguage } from "@/entities/user-text";

export interface SelectOption {
  value: UserTextLanguage;
  label: string;
}

// Config — not a hook, no 'use client' needed
export const getLanguageOptions = (
  t: (key: string) => string,
): SelectOption[] => [
  { value: "CHE", label: t("myTexts.fields.languageOptions.che") },
  { value: "RU", label: t("myTexts.fields.languageOptions.ru") },
  { value: "AR", label: t("myTexts.fields.languageOptions.ar") },
  { value: "EN", label: t("myTexts.fields.languageOptions.en") },
];
