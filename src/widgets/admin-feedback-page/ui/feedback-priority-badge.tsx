import { cn } from "@/shared/lib/cn";
import type { FeedbackPriority } from "@/entities/feedback";

import { Typography } from "@/shared/ui/typography";
type Translator = (key: string) => string;

const PRIORITY_CLASSES: Record<FeedbackPriority, string> = {
	LOW: "bg-surf-3 text-t-2",
	MEDIUM: "bg-amb-bg text-amb-t",
	HIGH: "bg-ros-bg text-ros-t",
	CRITICAL: "bg-red-bg text-red-t",
};

interface FeedbackPriorityBadgeProps {
	priority: FeedbackPriority;
	t: Translator;
	className?: string;
}

export const FeedbackPriorityBadge = ({ priority, t, className }: FeedbackPriorityBadgeProps) => (
	<Typography tag="span"
		className={cn(
			"inline-flex items-center rounded-[5px] px-[7px] py-[2px] text-[10px] font-semibold",
			PRIORITY_CLASSES[priority],
			className,
		)}
	>
		{t(`admin.feedback.priority.${priority}`)}
	</Typography>
);
