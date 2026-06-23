import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { MessageSquare } from "lucide-react";
type Translator = (key: string) => string;

interface FeedbackEmptyProps {
	t: Translator;
	onNewThread: () => void;
}

export const FeedbackEmpty = ({ t, onNewThread }: FeedbackEmptyProps) => (
	<div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
		<div className="mb-3 flex size-10 items-center justify-center rounded-[10px] bg-surf-2">
			<MessageSquare className="size-5 text-t-3" />
		</div>
		<Typography tag="p" className="mb-1 text-[13px] font-semibold text-t-1">
			{t("feedback.empty.title")}
		</Typography>
		<Typography tag="p" className="mb-4 text-[11.5px] leading-[1.5] text-t-3">
			{t("feedback.empty.description")}
		</Typography>
		<Button
			onClick={onNewThread}
			title={t("feedback.empty.action")}
			className="h-8 rounded-base bg-acc px-4 text-[12px] font-semibold text-white shadow-[0_1px_4px_rgba(34,84,211,0.3)] transition-opacity hover:opacity-[0.88]"
		>
			{t("feedback.empty.action")}
		</Button>
	</div>
);
