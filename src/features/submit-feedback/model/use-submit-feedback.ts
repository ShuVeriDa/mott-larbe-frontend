"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "@/entities/feedback";
import type { CreateFeedbackDto } from "@/entities/feedback";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useSubmitFeedback = () => {
	const qc = useQueryClient();
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (dto: CreateFeedbackDto) => feedbackApi.create(dto),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: feedbackKeys.root });
			qc.invalidateQueries({ queryKey: feedbackKeys.unreadCount() });
		},
		onError: toastApiError,
	});
};
