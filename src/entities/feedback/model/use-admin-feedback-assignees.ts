"use client";

import { useQuery } from "@tanstack/react-query";
import { adminFeedbackApi, adminFeedbackKeys } from "../api";

export const useAdminFeedbackAssignees = (enabled = false) =>
	useQuery({
		queryKey: adminFeedbackKeys.assignees(),
		queryFn: () => adminFeedbackApi.getAssignees(),
		enabled,
		staleTime: 60_000,
	});
