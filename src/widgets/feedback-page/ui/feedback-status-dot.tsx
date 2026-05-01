import { cn } from "@/shared/lib/cn";
import type { FeedbackStatus } from "@/entities/feedback";

type Translator = (key: string) => string;

interface FeedbackStatusDotProps {
	status: FeedbackStatus;
	t: Translator;
}

const STATUS_DOT_COLOR: Record<FeedbackStatus, string> = {
	NEW: "bg-acc",
	IN_PROGRESS: "bg-amb",
	ANSWERED: "bg-grn",
	RESOLVED: "bg-t-3",
};

export const FeedbackStatusDot = ({ status, t }: FeedbackStatusDotProps) => (
	<div className="flex items-center gap-1">
		<div
			className={cn("size-[5px] shrink-0 rounded-full", STATUS_DOT_COLOR[status])}
		/>
		<span className="text-[10.5px] text-t-2">
			{t(`feedback.statuses.${status}`)}
		</span>
	</div>
);
