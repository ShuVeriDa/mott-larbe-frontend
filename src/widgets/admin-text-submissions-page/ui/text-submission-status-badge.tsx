import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import type { TextSubmissionStatus } from "@/features/text-submission";

interface TextSubmissionStatusBadgeProps {
	status: TextSubmissionStatus;
	label: string;
}

const statusStyles: Record<TextSubmissionStatus, string> = {
	DRAFT: "bg-surf-2 text-t-3 dark:bg-surf-3",
	PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const TextSubmissionStatusBadge = ({ status, label }: TextSubmissionStatusBadgeProps) => (
	<Typography
		tag="span"
		className={cn(
			"inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium",
			statusStyles[status],
		)}
	>
		{label}
	</Typography>
);
