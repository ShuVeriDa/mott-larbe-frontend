import { Typography } from "@/shared/ui/typography";
import { MessageSquare } from "lucide-react";
type Translator = (key: string) => string;

export const FeedbackEmptyState = ({ t }: { t: Translator }) => (
	<div className="flex flex-1 flex-col items-center justify-center gap-2 max-sm:hidden">
		<div className="flex size-12 items-center justify-center rounded-xl bg-surf-2">
			<MessageSquare className="size-6 text-t-3" />
		</div>
		<Typography tag="p" className="text-[13px] text-t-3">{t("admin.feedback.selectTicket")}</Typography>
	</div>
);
