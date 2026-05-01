"use client";

import { useQuery } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "../api";

export const useFeedbackThread = (threadId: string | null) =>
	useQuery({
		queryKey: feedbackKeys.detail(threadId ?? ""),
		queryFn: () => feedbackApi.getById(threadId!),
		enabled: !!threadId,
		staleTime: 30_000,
	});
