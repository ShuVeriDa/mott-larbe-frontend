"use client";
import { useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { adminFeedbackApi, adminFeedbackKeys } from "../api";
import type { AdminFeedbackThread, PaginatedAdminFeedback } from "../api";

export const useAdminFeedbackThread = (threadId: string | null) => {
	const qc = useQueryClient();

	const query = useQuery({
		queryKey: adminFeedbackKeys.detail(threadId ?? ""),
		queryFn: () => adminFeedbackApi.getById(threadId!),
		enabled: !!threadId,
		staleTime: 10_000,
	});

	useEffect(() => {
		if (!threadId || !query.data) return;
		if (query.data.unreadCountAdmin === 0) return;

		// Optimistically zero out the badge in the infinite list cache
		qc.setQueriesData<InfiniteData<PaginatedAdminFeedback>>(
			{ queryKey: adminFeedbackKeys.list(), exact: false },
			(old) => {
				if (!old) return old;
				return {
					...old,
					pages: old.pages.map((page) => ({
						...page,
						items: page.items.map((t: AdminFeedbackThread) =>
							t.id === threadId ? { ...t, unreadCountAdmin: 0 } : t,
						),
					})),
				};
			},
		);

		adminFeedbackApi.markRead(threadId).then(() => {
			qc.invalidateQueries({ queryKey: adminFeedbackKeys.root });
			qc.invalidateQueries({ queryKey: adminFeedbackKeys.stats() });
		});
	}, [threadId, query.data, qc]);

	return query;
};
