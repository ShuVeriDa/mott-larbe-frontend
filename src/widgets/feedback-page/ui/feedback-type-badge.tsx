import { cn } from "@/shared/lib/cn";
import type { FeedbackType } from "@/entities/feedback";

type Translator = (key: string) => string;

interface FeedbackTypeBadgeProps {
	type: FeedbackType;
	t: Translator;
	className?: string;
}

const TYPE_STYLES: Record<FeedbackType, string> = {
	QUESTION: "bg-acc-bg text-acc-t",
	BUG: "bg-ros-bg text-ros-t",
	IDEA: "bg-pur-bg text-pur-t",
	COMPLAINT: "bg-amb-bg text-amb-t",
};

export const FeedbackTypeBadge = ({
	type,
	t,
	className,
}: FeedbackTypeBadgeProps) => (
	<span
		className={cn(
			"shrink-0 rounded-[4px] px-1.5 py-0.5 text-[10px] font-semibold",
			TYPE_STYLES[type],
			className,
		)}
	>
		{t(`feedback.threadTypes.${type}`)}
	</span>
);
