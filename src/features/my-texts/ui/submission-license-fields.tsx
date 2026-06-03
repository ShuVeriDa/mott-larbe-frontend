"use client";

import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Label } from "@/shared/ui/label";
import { Typography } from "@/shared/ui/typography";
import type { SubmissionLicenseType } from "@/features/text-submission";
import { getLicenseOptions } from "../lib/get-license-options";

// Shown only when submissionType === "EXTERNAL"
interface SubmissionLicenseFieldsProps {
  licenseType: SubmissionLicenseType | "";
  publicationYear: string;
  licenseTypeError?: string;
  onLicenseTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onPublicationYearChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
}

export const SubmissionLicenseFields = ({
  licenseType,
  publicationYear,
  licenseTypeError,
  onLicenseTypeChange,
  onPublicationYearChange,
  t,
}: SubmissionLicenseFieldsProps) => {
  const licenseOptions = getLicenseOptions(t);

  return (
    <div className="flex flex-col gap-3">
      {/* License type — required for EXTERNAL */}
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="submission-license"
          className="text-[12px] font-medium text-t-2"
        >
          {t("myTexts.fields.licenseType")}
        </Label>
        <Select
          id="submission-license"
          variant="lg"
          value={licenseType}
          onChange={onLicenseTypeChange}
        >
          <option value="">{t("myTexts.fields.licenseTypePlaceholder")}</option>
          {licenseOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        {licenseTypeError && (
          <Typography tag="p" className="text-[11.5px] text-red-500">
            {licenseTypeError}
          </Typography>
        )}
      </div>

      {/* Publication year — optional */}
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="submission-year"
          className="text-[12px] font-medium text-t-2"
        >
          {t("myTexts.fields.publicationYear")}
          <span className="ml-1 text-t-4">{t("myTexts.fields.optional")}</span>
        </Label>
        <Input
          id="submission-year"
          type="number"
          min={1000}
          max={new Date().getFullYear()}
          value={publicationYear}
          onChange={onPublicationYearChange}
          placeholder={String(new Date().getFullYear())}
          className="w-32"
        />
      </div>
    </div>
  );
};
