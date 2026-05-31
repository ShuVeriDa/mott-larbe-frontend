import { cn } from "@/shared/lib/cn";
import { Typography } from "@/shared/ui/typography";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

const statusStyles: Record<ReviewStatus, string> = {
	PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
	REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export const statusDotClass: Record<ReviewStatus, string> = {
	PENDING: "bg-yellow-400",
	APPROVED: "bg-green-500",
	REJECTED: "bg-red-400",
};

export const statusTextClass: Record<ReviewStatus, string> = {
	PENDING: "text-yellow-700 dark:text-yellow-400",
	APPROVED: "text-green-700 dark:text-green-400",
	REJECTED: "text-red-600 dark:text-red-400",
};

interface StatusBadgeProps {
	status: ReviewStatus;
	label: string;
}

export const StatusBadge = ({ status, label }: StatusBadgeProps) => (
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

interface StatusDotProps {
	status: ReviewStatus;
	className?: string;
}

export const StatusDot = ({ status, className }: StatusDotProps) => (
	<div className={cn("size-2 shrink-0 rounded-full", statusDotClass[status], className)} />
);
