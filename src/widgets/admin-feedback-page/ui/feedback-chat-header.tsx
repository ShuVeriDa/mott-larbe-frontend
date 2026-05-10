import { MouseEvent } from 'react';
import type { AdminFeedbackThread } from "@/entities/feedback";
import { cn } from "@/shared/lib/cn";
import { FeedbackStatusBadge } from "./feedback-status-badge";
import { FeedbackTypeBadge } from "./feedback-type-badge";
import { Button } from "@/shared/ui/button";
import { Typography } from "@/shared/ui/typography";
import { ChevronLeft, User, Link, MoreVertical } from "lucide-react";
type Translator = (key: string) => string;

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});

interface FeedbackChatHeaderProps {
	thread: AdminFeedbackThread;
	t: Translator;
	onBack: () => void;
	onInfoOpen: () => void;
	onCopyLink: () => void;
	onMoreMenu: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const FeedbackChatHeader = ({
	thread,
	t,
	onBack,
	onInfoOpen,
	onCopyLink,
	onMoreMenu,
}: FeedbackChatHeaderProps) => (
	<div className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3">
		{/* Mobile back button */}
		<Button
			onClick={onBack}
			className="hidden h-[30px] items-center gap-1.5 rounded-base border border-acc bg-acc-bg px-2.5 text-[12px] font-semibold text-acc-t max-sm:flex"
		>
			<ChevronLeft className="size-3.5" />
			{t("admin.feedback.back")}
		</Button>

		{/* Info */}
		<div className="min-w-0 flex-1">
			<div className="mb-[3px] flex flex-wrap items-center gap-1.5">
				<Typography tag="span" className="text-[10px] font-semibold tracking-[0.4px] text-t-3">
					#{thread.ticketNumber}
				</Typography>
				<FeedbackTypeBadge type={thread.type} t={t} />
				<FeedbackStatusBadge status={thread.status} t={t} />
			</div>
			<Typography tag="p" className="truncate text-[13px] font-semibold text-t-1">
				{thread.title ?? `#${thread.ticketNumber}`}
			</Typography>
			<div className={cn("mt-[3px] flex items-center gap-1.5 max-sm:hidden")}>
				<Typography tag="span" className="text-[11px] text-t-2">
					{thread.user.name} {thread.user.surname}
				</Typography>
				<Typography tag="span" className="text-[10px] text-t-4">·</Typography>
				<Typography tag="span" className="text-[11px] text-t-3">
					{formatDate(thread.createdAt)}
				</Typography>
			</div>
		</div>

		{/* Actions */}
		<div className="flex shrink-0 items-center gap-1.5">
			{/* Info toggle — shown on tablet/mobile */}
			<Button
				onClick={onInfoOpen}
				className="hidden h-[30px] items-center gap-1.5 rounded-base border border-acc bg-acc-bg px-2.5 text-[11.5px] font-semibold text-acc-t max-[960px]:flex"
			>
				<User className="size-[13px]" />
				Info
			</Button>

			{/* Copy link */}
			<Button
				onClick={onCopyLink}
				title={t("admin.feedback.actions.copyLink")}
				className="flex size-[30px] items-center justify-center rounded-base border border-bd-1 bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
			>
				<Link className="size-[13px]" />
			</Button>

			{/* More */}
			<Button
				onClick={onMoreMenu}
				className="flex size-[30px] items-center justify-center rounded-base border border-bd-1 bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
			>
				<MoreVertical className="size-[13px]" />
			</Button>
		</div>
	</div>
);
