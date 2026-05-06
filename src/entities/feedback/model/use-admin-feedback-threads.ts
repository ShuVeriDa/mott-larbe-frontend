"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { adminFeedbackApi, adminFeedbackKeys } from "../api";
import type { GetAdminFeedbackDto } from "../api";

export const useAdminFeedbackThreads = (query: Omit<GetAdminFeedbackDto, "page"> = {}) =>
	useInfiniteQuery({
		queryKey: adminFeedbackKeys.list(query),
		queryFn: ({ pageParam }) =>
			adminFeedbackApi.list({ ...query, page: pageParam as number }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			const fetched = (lastPage.page - 1) * lastPage.limit + lastPage.items.length;
			return fetched < lastPage.total ? lastPage.page + 1 : undefined;
		},
		staleTime: 15_000,
	});
