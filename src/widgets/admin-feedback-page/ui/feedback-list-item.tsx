import { cn } from "@/shared/lib/cn";
import type { AdminFeedbackThread } from "@/entities/feedback";
import { FeedbackTypeBadge } from "./feedback-type-badge";
import { FeedbackStatusDot } from "./feedback-status-badge";

import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
type Translator = (key: string) => string;

const formatDate = (iso: string): string => {
	const d = new Date(iso);
	const now = new Date();
	const diffMs = now.getTime() - d.getTime();
	const diffMin = Math.floor(diffMs / 60_000);
	if (diffMin < 60) return `${diffMin}m`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h`;
	const diffDay = Math.floor(diffHr / 24);
	if (diffDay < 7) return `${diffDay}d`;
	return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
};

const getUserInitials = (thread: AdminFeedbackThread): string => {
	const first = thread.user.name?.[0] ?? "";
	const last = thread.user.surname?.[0] ?? "";
	return (first + last).toUpperCase() || thread.user.username?.[0]?.toUpperCase() || "U";
};

const AV_COLORS = [
	"bg-pur-bg text-pur-t",
	"bg-grn-bg text-grn-t",
	"bg-amb-bg text-amb-t",
	"bg-acc-bg text-acc-t",
	"bg-surf-3 text-t-2",
];

const getAvColor = (id: string) => AV_COLORS[id.charCodeAt(0) % AV_COLORS.length];

interface FeedbackListItemProps {
	thread: AdminFeedbackThread;
	isActive: boolean;
	t: Translator;
	onClick: () => void;
}

export const FeedbackListItem = ({ thread, isActive, t, onClick }: FeedbackListItemProps) => {
	const initials = getUserInitials(thread);
	const avColor = getAvColor(thread.user.id);
	const dateLabel = formatDate(thread.updatedAt);
	const preview = thread.messages.at(-1)?.body ?? "";
	const isResolved = thread.status === "RESOLVED";

	return (
		<Button
			onClick={onClick}
			className={cn(
				"relative w-full cursor-pointer border-b border-bd-1 px-3.5 py-[11px] text-left transition-colors",
				isActive
					? "bg-acc-bg before:absolute before:bottom-0 before:left-0 before:top-0 before:w-0.5 before:rounded-r-sm before:bg-acc"
					: "hover:bg-surf-2",
				isResolved && "opacity-60",
			)}
		>
			{/* Row 1: avatar + name + date */}
			<div className="mb-[5px] flex items-center gap-1.5">
				<div
					className={cn(
						"flex size-[22px] shrink-0 items-center justify-center rounded-full text-[8.5px] font-bold",
						avColor,
					)}
				>
					{initials}
				</div>
				<Typography tag="span" className="flex-1 truncate text-[12px] font-semibold text-t-1">
					{thread.user.name} {thread.user.surname}
				</Typography>
				<Typography tag="span" className="shrink-0 text-[10.5px] text-t-3">{dateLabel}</Typography>
			</div>

			{/* Row 2: subject */}
			<Typography tag="p" className="mb-1 truncate text-[12px] font-medium text-t-1">
				{thread.title ?? `#${thread.ticketNumber}`}
			</Typography>

			{/* Row 3: preview */}
			<Typography tag="p" className="mb-[5px] line-clamp-2 text-[11px] leading-[1.4] text-t-2">
				{preview}
			</Typography>

			{/* Row 4: badges + status + unread */}
			<div className="flex items-center gap-1.5">
				<FeedbackTypeBadge type={thread.type} t={t} />
				<FeedbackStatusDot status={thread.status} className="ml-0.5" />
				<Typography tag="span" className="text-[10.5px] text-t-2">
					{t(`admin.feedback.status.${thread.status}`)}
				</Typography>
				{thread.unreadCountAdmin > 0 && (
					<Typography tag="span" className="ml-auto flex size-4 items-center justify-center rounded-full bg-acc text-[9px] font-bold text-white">
						{thread.unreadCountAdmin > 9 ? "9+" : thread.unreadCountAdmin}
					</Typography>
				)}
			</div>
		</Button>
	);
};
