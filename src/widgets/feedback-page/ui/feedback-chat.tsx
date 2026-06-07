"use client";

import { useFeedbackThread } from "@/entities/feedback";
import { useSendFeedbackMessage } from "@/features/send-feedback-message";
import { useMarkFeedbackRead } from "@/features/mark-feedback-read";
import { useMarkNotificationRead } from "@/features/mark-notification-read";
import { notificationKeys, type Notification } from "@/entities/notification";
import { useToastStore } from "@/shared/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { ComponentProps, useEffect } from "react";
import { FeedbackChatHeader } from "./feedback-chat-header";
import { FeedbackMessages } from "./feedback-messages";
import { FeedbackChatInput } from "./feedback-chat-input";
import { FeedbackChatSkeleton } from "./feedback-skeleton";

type Translator = (key: string) => string;

interface FeedbackChatProps {
	threadId: string;
	userInitials: string;
	isMobileVisible: boolean;
	t: Translator;
	onBack: () => void;
}

export const FeedbackChat = ({
	threadId,
	userInitials,
	isMobileVisible,
	t,
	onBack,
}: FeedbackChatProps) => {
	const { data: thread, isPending } = useFeedbackThread(threadId);
	const sendMessage = useSendFeedbackMessage(threadId);
	const { mutate: markReadThread } = useMarkFeedbackRead();
	const { mutate: markNotificationRead } = useMarkNotificationRead();
	const showToast = useToastStore(s => s.push);
	const qc = useQueryClient();
	const unreadCount = thread?.unreadCountUser ?? 0;

	useEffect(() => {
		if (unreadCount > 0) {
			markReadThread(threadId);
		}
	}, [threadId, unreadCount, markReadThread]);

	useEffect(() => {
		const notifications = qc.getQueryData<Notification[]>(notificationKeys.list());
		const match = notifications?.find(
			(n) => !n.isRead && n.type === "FEEDBACK_REPLY" && n.entityId === threadId,
		);
		if (match) markNotificationRead(match.id);
	}, [threadId, qc, markNotificationRead]);

	const isClosed = thread?.status === "RESOLVED";

	const handleSend: NonNullable<ComponentProps<typeof FeedbackChatInput>["onSend"]> = (text) =>
		sendMessage.mutate(text, { onSuccess: () => showToast(t("feedback.chat.toast.sent")) });

	return (
		<div
			className={[
				"flex flex-1 min-w-0 flex-col bg-bg transition-transform duration-300",
				// Mobile: absolute, slides in from right
				"max-sm:absolute max-sm:inset-0 max-sm:z-10",
				isMobileVisible ? "max-sm:translate-x-0" : "max-sm:translate-x-full",
			].join(" ")}
		>
			{isPending || !thread ? (
				<FeedbackChatSkeleton />
			) : (
				<>
					<FeedbackChatHeader thread={thread} t={t} onBack={onBack} />

					<FeedbackMessages
						messages={thread.messages.filter(
							(m) => m.messageType === "PUBLIC_REPLY",
						)}
						userInitials={userInitials}
						t={t}
					/>

					<FeedbackChatInput
						isClosed={isClosed}
						isPending={sendMessage.isPending}
						t={t}
						onSend={handleSend}
					/>
				</>
			)}
		</div>
	);
};
