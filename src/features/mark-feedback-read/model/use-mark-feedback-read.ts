"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "@/entities/feedback";

export const useMarkFeedbackRead = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (threadId: string) => feedbackApi.markRead(threadId),
		onSuccess: (_, threadId) => {
			qc.invalidateQueries({ queryKey: feedbackKeys.detail(threadId) });
			qc.invalidateQueries({ queryKey: feedbackKeys.root });
			qc.invalidateQueries({ queryKey: feedbackKeys.unreadCount() });
		},
	});
};
