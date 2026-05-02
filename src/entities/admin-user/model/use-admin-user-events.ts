"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";
import type { FetchUserEventsQuery } from "../api/types";

export const useAdminUserEvents = (userId: string, query: FetchUserEventsQuery = {}) =>
	useQuery({
		queryKey: adminUserKeys.events(userId, query),
		queryFn: () => adminUserApi.getEvents(userId, query),
		enabled: !!userId,
	});

export const useAdminUserEventsSummary = (userId: string) =>
	useQuery({
		queryKey: adminUserKeys.eventsSummary(userId),
		queryFn: () => adminUserApi.getEventsSummary(userId),
		enabled: !!userId,
	});
