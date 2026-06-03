import type { SubmissionType } from "@/features/text-submission";

export interface SubmissionTypeOption {
  value: SubmissionType;
  label: string;
}

// Config — not a hook, no 'use client' needed
export const getSubmissionTypeOptions = (
  t: (key: string) => string,
): SubmissionTypeOption[] => [
  { value: "EXTERNAL", label: t("myTexts.type.external") },
  { value: "ORIGINAL", label: t("myTexts.type.original") },
];
