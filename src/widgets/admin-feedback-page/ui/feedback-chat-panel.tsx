import { cn } from "@/shared/lib/cn";
import type { AdminFeedbackThread, FeedbackStatus, FeedbackPriority } from "@/entities/feedback";
import { FeedbackChatHeader } from "./feedback-chat-header";
import { FeedbackMessagesList } from "./feedback-messages-list";
import { FeedbackAdminInput } from "./feedback-admin-input";
import { FeedbackInfoPanel } from "./feedback-info-panel";

type Translator = (key: string) => string;

interface FeedbackChatPanelProps {
	thread: AdminFeedbackThread;
	inputMode: "reply" | "note";
	isReplying: boolean;
	isMobileVisible: boolean;
	t: Translator;
	onBack: () => void;
	onInfoOpen: () => void;
	onCopyLink: () => void;
	onMoreMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onModeChange: (mode: "reply" | "note") => void;
	onSend: (body: string, isInternal: boolean) => void;
	onReopen: () => void;
	onStatusChange: (s: FeedbackStatus) => void;
	onPriorityChange: (p: FeedbackPriority) => void;
	onAssignOpen: () => void;
	onClose: () => void;
	onDelete: () => void;
}

export const FeedbackChatPanel = ({
	thread,
	inputMode,
	isReplying,
	isMobileVisible,
	t,
	onBack,
	onInfoOpen,
	onCopyLink,
	onMoreMenu,
	onModeChange,
	onSend,
	onReopen,
	onStatusChange,
	onPriorityChange,
	onAssignOpen,
	onClose,
	onDelete,
}: FeedbackChatPanelProps) => (
	<div
		className={cn(
			"flex min-w-0 flex-1 flex-col overflow-hidden bg-bg",
			isMobileVisible ? "max-sm:flex" : "max-sm:hidden",
		)}
	>
		<FeedbackChatHeader
			thread={thread}
			t={t}
			onBack={onBack}
			onInfoOpen={onInfoOpen}
			onCopyLink={onCopyLink}
			onMoreMenu={onMoreMenu}
		/>

		<div className="flex min-h-0 flex-1 overflow-hidden">
			{/* Messages + input */}
			<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
				<FeedbackMessagesList
					messages={thread.messages}
					noteLabel={t("admin.feedback.input.noteLabel")}
				/>
				<FeedbackAdminInput
					isClosed={thread.status === "RESOLVED"}
					isPending={isReplying}
					inputMode={inputMode}
					t={t}
					onModeChange={onModeChange}
					onSend={onSend}
					onReopen={onReopen}
				/>
			</div>

			{/* Desktop right panel — hidden on ≤960px (drawer used instead) */}
			<FeedbackInfoPanel
				thread={thread}
				t={t}
				onStatusChange={onStatusChange}
				onPriorityChange={onPriorityChange}
				onAssignOpen={onAssignOpen}
				onClose={onClose}
				onReopen={onReopen}
				onDelete={onDelete}
				className="max-[960px]:hidden"
			/>
		</div>
	</div>
);
