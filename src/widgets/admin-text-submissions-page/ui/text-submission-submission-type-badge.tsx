import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import type { SubmissionType } from "@/features/text-submission";

// Purely presentational — no hooks, no 'use client' needed
interface TextSubmissionSubmissionTypeBadgeProps {
	submissionType: SubmissionType;
	t: (key: string) => string;
}

const typeStyles: Record<SubmissionType, string> = {
	ORIGINAL: "bg-acc/10 text-acc",
	EXTERNAL: "bg-surf-2 text-t-3",
};

export const TextSubmissionSubmissionTypeBadge = ({
	submissionType,
	t,
}: TextSubmissionSubmissionTypeBadgeProps) => (
	<Typography
		tag="span"
		className={cn(
			"inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
			typeStyles[submissionType],
		)}
	>
		{t(`adminTextSubmissions.submissionType.${submissionType}`)}
	</Typography>
);
