import { cn } from "@/shared/lib/cn";
import type { FeedbackMessage } from "@/entities/feedback";

type Translator = (key: string) => string;

interface FeedbackMessageBubbleProps {
	message: FeedbackMessage;
	userInitials: string;
	t: Translator;
}

const formatTime = (iso: string): string => {
	const d = new Date(iso);
	return d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
};

export const FeedbackMessageBubble = ({
	message,
	userInitials,
	t,
}: FeedbackMessageBubbleProps) => {
	const isUser = message.authorType === "USER";
	const time = formatTime(message.createdAt);

	return (
		<div
			className={cn(
				"flex animate-[fadeUp_0.2s_ease_both] items-end gap-2",
				isUser && "flex-row-reverse",
			)}
		>
			{/* Avatar */}
			<div
				className={cn(
					"flex size-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
					isUser ? "bg-acc-bg text-acc-t" : "bg-grn-bg text-grn-t",
				)}
			>
				{isUser ? userInitials : t("feedback.chat.supportInitials")}
			</div>

			{/* Body */}
			<div
				className={cn(
					"flex max-w-[68%] flex-col gap-[3px]",
					isUser && "items-end",
					"max-sm:max-w-[82%]",
				)}
			>
				<div
					className={cn(
						"rounded-xl px-3 py-[9px] text-[12.5px] leading-[1.55] shadow-sm",
						isUser
							? "rounded-br-[3px] bg-acc text-white"
							: "rounded-bl-[3px] border border-bd-1 bg-surf text-t-1",
					)}
				>
					{message.body}
				</div>
				<span className="text-[10px] text-t-3">{time}</span>
			</div>
		</div>
	);
};
