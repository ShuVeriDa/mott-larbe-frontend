import type { FeedbackThread } from "@/entities/feedback";
import { cn } from "@/shared/lib/cn";
import { FeedbackStatusDot } from "./feedback-status-dot";
import { FeedbackTypeBadge } from "./feedback-type-badge";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
type Translator = (key: string) => string;

interface FeedbackThreadItemProps {
	thread: FeedbackThread;
	isActive: boolean;
	t: Translator;
	onClick: () => void;
}

const formatDate = (iso: string, todayLabel: string): string => {
	const d = new Date(iso);
	const now = new Date();
	const isToday =
		d.getDate() === now.getDate() &&
		d.getMonth() === now.getMonth() &&
		d.getFullYear() === now.getFullYear();
	if (isToday) return todayLabel;
	return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
};

export const FeedbackThreadItem = ({
	thread,
	isActive,
	t,
	onClick,
}: FeedbackThreadItemProps) => {
	const dateLabel = formatDate(thread.createdAt, t("feedback.today"));
	const unread = thread.unreadCountUser;

	const lastMessage = thread.messages[thread.messages.length - 1];

	return (
		<Button
			variant={"bare"}
			size={"bare"}
			onClick={onClick}
			title={thread.title ?? thread.body}
			className={cn(
				"relative flex flex-col w-full gap-2 cursor-pointer rounded-none border-b border-bd-1 px-2 py-1.5 text-left transition-colors",
				isActive
					? "bg-acc-bg before:absolute before:bottom-0 before:left-0 before:top-0 before:w-[3px] before:rounded-r-sm before:bg-acc"
					: "hover:bg-surf-2 active:bg-surf-3",
			)}
		>
			{/* Row 1: badge + title | status */}
			<div className="flex items-center justify-between gap-2 w-full">
				<div className="flex items-center gap-1.5 min-w-0">
					<FeedbackTypeBadge type={thread.type} t={t} className="shrink-0" />
					<Typography
						tag="p"
						className="truncate text-[12.5px] font-semibold leading-normal text-t-1"
					>
						{thread.title ?? thread.body}
					</Typography>
				</div>
				<FeedbackStatusDot status={thread.status} t={t} />
			</div>

			{/* Row 2: last message preview | date + unread */}
			<div className="flex items-center justify-between gap-2 w-full">
				<Typography
					tag="p"
					className="truncate text-[11px] leading-normal text-t-3"
				>
					{lastMessage?.body ?? ""}
				</Typography>

				<div className="flex shrink-0 items-center gap-1.5">
					<Typography tag="span" className="text-[10.5px] text-t-3">
						{dateLabel}
					</Typography>
					{unread > 0 && (
						<div className="flex size-[18px] items-center justify-center rounded-full bg-acc text-[10px] font-bold text-white">
							{unread > 9 ? "9+" : unread}
						</div>
					)}
				</div>
			</div>
		</Button>
	);
};
