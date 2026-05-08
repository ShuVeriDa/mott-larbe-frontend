import type { AdminFeedbackThread } from "@/entities/feedback";
import { cn } from "@/shared/lib/cn";
import { FeedbackStatusBadge } from "./feedback-status-badge";
import { FeedbackTypeBadge } from "./feedback-type-badge";

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
	onMoreMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
		<button
			type="button"
			onClick={onBack}
			className="hidden h-[30px] items-center gap-1.5 rounded-base border border-acc bg-acc-bg px-2.5 text-[12px] font-semibold text-acc-t max-sm:flex"
		>
			<svg viewBox="0 0 16 16" fill="none" className="size-3.5">
				<path
					d="M10 3L5 8l5 5"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
			{t("admin.feedback.back")}
		</button>

		{/* Info */}
		<div className="min-w-0 flex-1">
			<div className="mb-[3px] flex flex-wrap items-center gap-1.5">
				<span className="text-[10px] font-semibold tracking-[0.4px] text-t-3">
					#{thread.ticketNumber}
				</span>
				<FeedbackTypeBadge type={thread.type} t={t} />
				<FeedbackStatusBadge status={thread.status} t={t} />
			</div>
			<p className="truncate text-[13px] font-semibold text-t-1">
				{thread.title ?? `#${thread.ticketNumber}`}
			</p>
			<div className={cn("mt-[3px] flex items-center gap-1.5 max-sm:hidden")}>
				<span className="text-[11px] text-t-2">
					{thread.user.name} {thread.user.surname}
				</span>
				<span className="text-[10px] text-t-4">·</span>
				<span className="text-[11px] text-t-3">
					{formatDate(thread.createdAt)}
				</span>
			</div>
		</div>

		{/* Actions */}
		<div className="flex shrink-0 items-center gap-1.5">
			{/* Info toggle — shown on tablet/mobile */}
			<button
				type="button"
				onClick={onInfoOpen}
				className="hidden h-[30px] items-center gap-1.5 rounded-base border border-acc bg-acc-bg px-2.5 text-[11.5px] font-semibold text-acc-t max-[960px]:flex"
			>
				<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
					<circle
						cx="8"
						cy="5.5"
						r="2.5"
						stroke="currentColor"
						strokeWidth="1.3"
					/>
					<path
						d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
				Info
			</button>

			{/* Copy link */}
			<button
				type="button"
				onClick={onCopyLink}
				title={t("admin.feedback.actions.copyLink")}
				className="flex size-[30px] items-center justify-center rounded-base border border-bd-1 bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
			>
				<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
					<path
						d="M6.5 3.5H4a1.5 1.5 0 000 3h1m4-3H11.5a1.5 1.5 0 010 3H10M5 8h6"
						stroke="currentColor"
						strokeWidth="1.3"
						strokeLinecap="round"
					/>
				</svg>
			</button>

			{/* More */}
			<button
				type="button"
				onClick={onMoreMenu}
				className="flex size-[30px] items-center justify-center rounded-base border border-bd-1 bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 hover:text-t-1"
			>
				<svg viewBox="0 0 16 16" fill="none" className="size-[13px]">
					<circle cx="8" cy="4" r="1" fill="currentColor" />
					<circle cx="8" cy="8" r="1" fill="currentColor" />
					<circle cx="8" cy="12" r="1" fill="currentColor" />
				</svg>
			</button>
		</div>
	</div>
);
