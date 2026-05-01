"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "@/entities/feedback";

export const useSendFeedbackMessage = (threadId: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: string) => feedbackApi.addMessage(threadId, { body }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: feedbackKeys.detail(threadId) });
			qc.invalidateQueries({ queryKey: feedbackKeys.root });
		},
	});
};
