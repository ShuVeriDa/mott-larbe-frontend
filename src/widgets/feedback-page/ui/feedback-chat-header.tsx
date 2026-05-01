import type { FeedbackThread } from "@/entities/feedback";
import { FeedbackTypeBadge } from "./feedback-type-badge";
import { FeedbackStatusDot } from "./feedback-status-dot";

type Translator = (key: string) => string;

interface FeedbackChatHeaderProps {
	thread: FeedbackThread;
	t: Translator;
	onBack: () => void;
}

const formatFullDate = (iso: string): string => {
	const d = new Date(iso);
	return d.toLocaleDateString("ru-RU", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

export const FeedbackChatHeader = ({
	thread,
	t,
	onBack,
}: FeedbackChatHeaderProps) => (
	<div className="flex shrink-0 items-center gap-2.5 border-b border-bd-1 bg-surf px-5 py-3 transition-colors max-sm:px-3.5">
		{/* Back button — mobile only */}
		<button
			type="button"
			onClick={onBack}
			aria-label={t("feedback.back")}
			className="hidden size-[30px] shrink-0 items-center justify-center rounded-lg border border-bd-1 bg-surf-2 text-t-2 transition-colors hover:bg-surf-3 max-sm:flex"
		>
			<svg
				viewBox="0 0 16 16"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="size-3.5"
			>
				<path d="M10 3L5 8l5 5" />
			</svg>
		</button>

		<div className="min-w-0 flex-1">
			<p className="truncate text-[13px] font-semibold text-t-1">
				{thread.title ?? thread.body.slice(0, 60)}
			</p>
			<div className="mt-0.5 flex items-center gap-1.5">
				<FeedbackTypeBadge type={thread.type} t={t} />
				<span className="text-[11px] text-t-3">
					{formatFullDate(thread.createdAt)}
				</span>
			</div>
		</div>

		<div className="shrink-0">
			<FeedbackStatusDot status={thread.status} t={t} />
		</div>
	</div>
);
