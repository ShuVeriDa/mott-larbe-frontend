import { cn } from "@/shared/lib/cn";
import type { FeedbackThread } from "@/entities/feedback";
import { FeedbackTypeBadge } from "./feedback-type-badge";
import { FeedbackStatusDot } from "./feedback-status-dot";

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

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"relative w-full cursor-pointer border-b border-bd-1 px-4 py-[11px] text-left transition-colors",
				isActive
					? "bg-acc-bg before:absolute before:bottom-0 before:left-0 before:top-0 before:w-0.5 before:rounded-r-sm before:bg-acc"
					: "hover:bg-surf-2 active:bg-surf-3",
			)}
		>
			<div className="mb-1 flex items-center justify-between gap-1.5">
				<FeedbackTypeBadge type={thread.type} t={t} />
				<span className="shrink-0 text-[10.5px] text-t-3">{dateLabel}</span>
			</div>

			<p className="mb-1 line-clamp-2 text-[11.5px] leading-[1.45] text-t-1">
				{thread.title ?? thread.body}
			</p>

			<div className="flex items-center justify-between">
				<FeedbackStatusDot status={thread.status} t={t} />
				{unread > 0 && (
					<div className="flex size-4 items-center justify-center rounded-full bg-acc text-[9px] font-bold text-white">
						{unread > 9 ? "9+" : unread}
					</div>
				)}
			</div>
		</button>
	);
};
