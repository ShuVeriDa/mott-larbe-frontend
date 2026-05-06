"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { feedbackApi, feedbackKeys } from "../api";
import type { GetFeedbackDto } from "../api";

export const useFeedbackThreads = (query: GetFeedbackDto = {}) =>
	useInfiniteQuery({
		queryKey: feedbackKeys.list(query),
		queryFn: ({ pageParam }) => feedbackApi.list({ ...query, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page * lastPage.limit < lastPage.total
				? lastPage.page + 1
				: undefined,
		staleTime: 30_000,
	});
