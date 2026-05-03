import { cn } from "@/shared/lib/cn";
import type { FeedbackStatus } from "@/entities/feedback";

type Translator = (key: string) => string;

const STATUS_CLASSES: Record<FeedbackStatus, string> = {
	NEW: "bg-amb-bg text-amb-t",
	IN_PROGRESS: "bg-acc-bg text-acc-t",
	ANSWERED: "bg-grn-bg text-grn-t",
	RESOLVED: "bg-surf-3 text-t-2",
};

const STATUS_DOT_CLASSES: Record<FeedbackStatus, string> = {
	NEW: "bg-amb",
	IN_PROGRESS: "bg-acc",
	ANSWERED: "bg-grn",
	RESOLVED: "bg-t-3",
};

interface FeedbackStatusBadgeProps {
	status: FeedbackStatus;
	t: Translator;
	className?: string;
}

interface FeedbackStatusDotProps {
	status: FeedbackStatus;
	className?: string;
}

export const FeedbackStatusBadge = ({ status, t, className }: FeedbackStatusBadgeProps) => (
	<span
		className={cn(
			"inline-flex items-center rounded-[5px] px-[7px] py-[2px] text-[10px] font-semibold",
			STATUS_CLASSES[status],
			className,
		)}
	>
		{t(`admin.feedback.status.${status}`)}
	</span>
);

export const FeedbackStatusDot = ({ status, className }: FeedbackStatusDotProps) => (
	<span
		className={cn(
			"inline-block size-[5px] shrink-0 rounded-full",
			STATUS_DOT_CLASSES[status],
			className,
		)}
	/>
);
