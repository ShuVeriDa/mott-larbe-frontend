"use client";
import { useEffect } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminFeedbackApi, adminFeedbackKeys } from "../api";

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
		if (query.data.unreadCountAdmin > 0) {
			adminFeedbackApi.markRead(threadId).then(() => {
				qc.invalidateQueries({ queryKey: adminFeedbackKeys.root });
				qc.invalidateQueries({ queryKey: adminFeedbackKeys.stats() });
			});
		}
	}, [threadId, query.data, qc]);

	return query;
};
