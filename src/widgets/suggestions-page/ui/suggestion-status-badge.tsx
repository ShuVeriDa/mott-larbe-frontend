import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";
import type { SuggestionStatus } from "@/features/suggestions";

interface SuggestionStatusBadgeProps {
	status: SuggestionStatus;
	label: string;
}

const statusStyles: Record<SuggestionStatus, string> = {
	PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const SuggestionStatusBadge = ({ status, label }: SuggestionStatusBadgeProps) => (
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
