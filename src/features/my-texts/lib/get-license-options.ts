import type { SubmissionLicenseType } from "@/features/text-submission";

export interface LicenseOption {
  value: SubmissionLicenseType;
  label: string;
}

// Config — not a hook, no 'use client' needed
export const getLicenseOptions = (
  t: (key: string) => string,
): LicenseOption[] => [
  { value: "PUBLIC_DOMAIN", label: t("myTexts.license.publicDomain") },
  { value: "CC", label: t("myTexts.license.cc") },
  { value: "PERMISSION", label: t("myTexts.license.permission") },
  { value: "UNKNOWN", label: t("myTexts.license.unknown") },
];
