"use client";

import { useQuery } from "@tanstack/react-query";
import { adminFeedbackApi, adminFeedbackKeys } from "../api";

export const useAdminFeedbackStats = () =>
	useQuery({
		queryKey: adminFeedbackKeys.stats(),
		queryFn: () => adminFeedbackApi.getStats(),
		staleTime: 30_000,
	});
