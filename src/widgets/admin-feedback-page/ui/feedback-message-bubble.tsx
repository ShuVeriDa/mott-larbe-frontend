import { cn } from "@/shared/lib/cn";
import type { AdminFeedbackMessage } from "@/entities/feedback";

const formatTime = (iso: string) =>
	new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

interface FeedbackMessageBubbleProps {
	message: AdminFeedbackMessage;
	noteLabel: string;
}

export const FeedbackMessageBubble = ({ message, noteLabel }: FeedbackMessageBubbleProps) => {
	const isAdmin = message.authorType === "ADMIN";
	const isNote = message.messageType === "INTERNAL_NOTE";
	const authorName = message.author
		? `${message.author.name} ${message.author.surname}`.trim()
		: isAdmin
			? "Admin"
			: "User";

	return (
		<div
			className={cn(
				"flex animate-[fadeUp_0.2s_ease_both] items-end gap-2.5",
				isAdmin && "flex-row-reverse",
			)}
		>
			{/* Avatar */}
			<div
				className={cn(
					"flex size-[26px] shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
					isAdmin ? "bg-acc-bg text-acc-t" : "bg-surf-3 text-t-2",
				)}
			>
				{(message.author?.name?.[0] ?? (isAdmin ? "A" : "U")).toUpperCase()}
			</div>

			{/* Content */}
			<div
				className={cn(
					"flex max-w-[65%] flex-col gap-[3px]",
					isAdmin && "items-end",
				)}
			>
				{isNote && (
					<div className="flex items-center gap-1 text-[10px] font-semibold text-amb-t">
						<svg viewBox="0 0 16 16" fill="none" className="size-[11px]">
							<path
								d="M2 5h12v8a1 1 0 01-1 1H3a1 1 0 01-1-1V5zm4-3h4"
								stroke="currentColor"
								strokeWidth="1.3"
								strokeLinecap="round"
							/>
						</svg>
						{noteLabel}
					</div>
				)}
				{!isNote && (
					<p className={cn("text-[10.5px] text-t-3", isAdmin && "text-right")}>
						{authorName} · {formatTime(message.createdAt)}
					</p>
				)}

				<div
					className={cn(
						"rounded-xl px-3 py-[9px] text-[12.5px] leading-[1.55] shadow-[0_1px_3px_rgba(0,0,0,0.07)]",
						isNote
							? "rounded-lg border border-[rgba(217,119,6,0.25)] bg-amb-bg text-amb-t"
							: isAdmin
								? "rounded-tr-sm bg-acc text-white"
								: "rounded-tl-sm border border-bd-1 bg-surf text-t-1",
					)}
				>
					{message.body}
				</div>

				<p className={cn("text-[10px] text-t-3", isAdmin && "text-right")}>
					{formatTime(message.createdAt)}
				</p>
			</div>
		</div>
	);
};
