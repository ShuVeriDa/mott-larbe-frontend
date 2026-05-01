"use client";

import { useQuery } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "../api";

export const useFeedbackUnreadCount = () =>
	useQuery({
		queryKey: feedbackKeys.unreadCount(),
		queryFn: () => feedbackApi.getUnreadCount(),
		staleTime: 60_000,
		refetchInterval: 60_000,
	});
