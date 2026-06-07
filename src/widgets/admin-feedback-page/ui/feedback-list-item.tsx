import type { AdminFeedbackThread } from "@/entities/feedback";
import { cn } from "@/shared/lib/cn";
import { getAvColor } from "@/shared/lib/avatar-colors";
import { FeedbackStatusBadge } from "./feedback-status-badge";
import { FeedbackTypeBadge } from "./feedback-type-badge";

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
	return (
		(first + last).toUpperCase() ||
		thread.user.username?.[0]?.toUpperCase() ||
		"U"
	);
};


interface FeedbackListItemProps {
	thread: AdminFeedbackThread;
	isActive: boolean;
	t: Translator;
	onClick: () => void;
}

export const FeedbackListItem = ({
	thread,
	isActive,
	t,
	onClick,
}: FeedbackListItemProps) => {
	const initials = getUserInitials(thread);
	const avColor = getAvColor(thread.user.id);
	const dateLabel = formatDate(thread.updatedAt);
	const preview = thread.messages.at(-1)?.body ?? "";
	const isResolved = thread.status === "RESOLVED";

	return (
		<Button
			variant="bare"
			size="bare"
			onClick={onClick}
			title={thread.title ?? `#${thread.ticketNumber}`}
			className={cn(
				"relative flex w-full flex-col gap-1 cursor-pointer rounded-none border-b border-bd-1 px-3 py-2.5 text-left transition-colors",
				isActive
					? "bg-acc-bg before:absolute before:bottom-0 before:left-0 before:top-0 before:w-[3px] before:rounded-r-sm before:bg-acc"
					: "hover:bg-surf-2",
				isResolved && "opacity-60",
			)}
		>
			{/* Row 1: type badge | title + status badge */}
			<div className="flex items-center gap-2 w-full">
				<FeedbackTypeBadge type={thread.type} t={t} tKeyPrefix="admin.feedback.type" className="shrink-0" />
				<Typography
					tag="p"
					className="flex-1 truncate text-[11px] font-semibold text-t-1"
				>
					{thread.title ?? `#${thread.ticketNumber}`}
				</Typography>
				<FeedbackStatusBadge
					status={thread.status}
					t={t}
					className="shrink-0"
				/>
			</div>

			{/* Rows 2–3: big avatar (spans both rows) + name/date + preview/unread */}
			<div className="flex items-stretch gap-2.5 w-full">
				{/* Avatar — spans rows 2 and 3 */}
				<div
					className={cn(
						"flex size-9 shrink-0 self-center items-center justify-center rounded-full text-[13px] font-bold",
						avColor,
					)}
				>
					{initials}
				</div>

				{/* Right side: name+date / preview+unread */}
				<div className="flex flex-1 min-w-0 flex-col gap-0.5">
					{/* Row 2: name | date */}
					<div className="flex items-center justify-between gap-2">
						<Typography
							tag="span"
							className="truncate text-[11px] font-semibold text-t-1"
						>
							{thread.user.name} {thread.user.surname}
						</Typography>
						<Typography tag="span" className="shrink-0 text-[10px] text-t-3">
							{dateLabel}
						</Typography>
					</div>

					{/* Row 3: preview | unread */}
					<div className="flex items-center justify-between gap-2">
						<Typography tag="p" className="truncate text-[11px] text-t-3">
							{preview}
						</Typography>
						{thread.unreadCountAdmin > 0 && (
							<div className="flex shrink-0 size-[16px] items-center justify-center rounded-full bg-acc text-[8px] font-bold text-white">
								{thread.unreadCountAdmin > 9 ? "9+" : thread.unreadCountAdmin}
							</div>
						)}
					</div>
				</div>
			</div>
		</Button>
	);
};
