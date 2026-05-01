"use client";

import { useQuery } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "../api";
import type { GetFeedbackDto } from "../api";

export const useFeedbackThreads = (query: GetFeedbackDto = {}) =>
	useQuery({
		queryKey: feedbackKeys.list(query),
		queryFn: () => feedbackApi.list(query),
		staleTime: 30_000,
	});
