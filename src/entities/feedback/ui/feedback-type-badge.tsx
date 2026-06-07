import { cn } from "@/shared/lib/cn";
import type { FeedbackType } from "../api/types";
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
	tKeyPrefix?: string;
	className?: string;
}

export const FeedbackTypeBadge = ({
	type,
	t,
	tKeyPrefix = "feedback.threadTypes",
	className,
}: FeedbackTypeBadgeProps) => (
	<Typography
		tag="span"
		className={cn(
			"inline-flex shrink-0 items-center rounded-[5px] px-[7px] py-[2px] text-[10px] font-semibold",
			TYPE_CLASSES[type],
			className,
		)}
	>
		{t(`${tKeyPrefix}.${type}`)}
	</Typography>
);
