import type { UserTextType } from "@/entities/user-text";

export interface TypeSelectOption {
  value: UserTextType;
  label: string;
  description: string;
}

// Config — not a hook, no 'use client' needed
export const getTypeOptions = (
  t: (key: string) => string,
): TypeSelectOption[] => [
  {
    value: "EXTERNAL",
    label: t("myTexts.type.external"),
    description: t("myTexts.type.externalDesc"),
  },
  {
    value: "ORIGINAL",
    label: t("myTexts.type.original"),
    description: t("myTexts.type.originalDesc"),
  },
];
