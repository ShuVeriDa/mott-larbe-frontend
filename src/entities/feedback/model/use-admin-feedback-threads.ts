"use client";

import { useQuery } from "@tanstack/react-query";
import { adminFeedbackApi, adminFeedbackKeys } from "../api";
import type { GetAdminFeedbackDto } from "../api";

export const useAdminFeedbackThreads = (query: GetAdminFeedbackDto = {}) =>
	useQuery({
		queryKey: adminFeedbackKeys.list(query),
		queryFn: () => adminFeedbackApi.list(query),
		staleTime: 15_000,
	});
