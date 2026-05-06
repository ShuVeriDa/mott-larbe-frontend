"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "@/entities/feedback";
import type { FeedbackThread, FeedbackMessage } from "@/entities/feedback";

export const useSendFeedbackMessage = (threadId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: string) => feedbackApi.addMessage(threadId, { body }),
		onMutate: async (body: string) => {
			await qc.cancelQueries({ queryKey: feedbackKeys.thread(threadId) });
			const previous = qc.getQueryData<FeedbackThread>(
				feedbackKeys.thread(threadId),
			);
			if (previous) {
				const optimistic: FeedbackMessage = {
					id: `optimistic-${Date.now()}`,
					threadId,
					body,
					authorType: "USER",
					messageType: "PUBLIC_REPLY",
					isReadByUser: true,
					isReadByAdmin: false,
					createdAt: new Date().toISOString(),
					author: null,
				};
				qc.setQueryData<FeedbackThread>(feedbackKeys.thread(threadId), {
					...previous,
					messages: [...previous.messages, optimistic],
				});
			}
			return { previous };
		},
		onError: (_, __, context) => {
			if (context?.previous) {
				qc.setQueryData(feedbackKeys.thread(threadId), context.previous);
			}
		},
		onSettled: () => {
			qc.invalidateQueries({ queryKey: feedbackKeys.thread(threadId) });
			qc.invalidateQueries({ queryKey: feedbackKeys.root });
		},
	});
};
