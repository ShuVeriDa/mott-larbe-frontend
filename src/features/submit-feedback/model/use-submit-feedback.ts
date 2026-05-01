"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "@/entities/feedback";
import type { CreateFeedbackDto } from "@/entities/feedback";

export const useSubmitFeedback = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateFeedbackDto) => feedbackApi.create(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: feedbackKeys.root });
			qc.invalidateQueries({ queryKey: feedbackKeys.unreadCount() });
		},
	});
};
