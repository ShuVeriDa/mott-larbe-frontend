import { cn } from "@/shared/lib/cn";
import type { FeedbackType } from "@/entities/feedback";

import { Typography } from "@/shared/ui/typography";
type Translator = (key: string) => string;

const TYPE_CLASSES: Record<FeedbackType, string> = {
	QUESTION: "bg-acc-bg text-acc-t",
	BUG: "bg-ros-bg text-ros-t",
	IDEA: "bg-pur-bg text-pur-t",
	COMPLAINT: "bg-amb-bg text-amb-t",
};

interface FeedbackTypeBadgeProps {
	type: FeedbackType;
	t: Translator;
	className?: string;
}

export const FeedbackTypeBadge = ({ type, t, className }: FeedbackTypeBadgeProps) => (
	<Typography tag="span"
		className={cn(
			"inline-flex items-center rounded-[5px] px-[7px] py-[2px] text-[10px] font-semibold",
			TYPE_CLASSES[type],
			className,
		)}
	>
		{t(`admin.feedback.type.${type}`)}
	</Typography>
);
