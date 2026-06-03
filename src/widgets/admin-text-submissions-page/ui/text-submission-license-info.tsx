import { Typography } from "@/shared/ui/typography";
import { InfoCard } from "@/shared/ui/review-panel";
import type { SubmissionLicenseType } from "@/features/text-submission";

// Purely presentational — no hooks, no 'use client' needed
interface TextSubmissionLicenseInfoProps {
	licenseType: SubmissionLicenseType | undefined;
	publicationYear: number | undefined;
	t: (key: string) => string;
}

export const TextSubmissionLicenseInfo = ({
	licenseType,
	publicationYear,
	t,
}: TextSubmissionLicenseInfoProps) => {
	if (!licenseType && !publicationYear) return null;

	return (
		<InfoCard label={t("adminTextSubmissions.fields.license")} className="mb-4">
			<div className="flex flex-wrap items-center gap-3">
				{licenseType && (
					<Typography tag="span" className="text-[12.5px] text-t-2">
						{t(`adminTextSubmissions.licenseType.${licenseType}`)}
					</Typography>
				)}
				{publicationYear && (
					<Typography tag="span" className="text-[12.5px] text-t-3">
						{publicationYear}
					</Typography>
				)}
			</div>
		</InfoCard>
	);
};
