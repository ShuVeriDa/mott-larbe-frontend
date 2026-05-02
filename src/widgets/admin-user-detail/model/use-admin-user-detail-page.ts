"use client";

import { useCallback, useState } from "react";
import { useAdminUserDetail } from "@/entities/admin-user/model/use-admin-user-detail";
import { useAdminUserRoles } from "@/entities/admin-user/model/use-admin-user-roles";
import { useAdminUserEvents, useAdminUserEventsSummary } from "@/entities/admin-user/model/use-admin-user-events";
import { useAdminUserSubscription } from "@/entities/admin-user/model/use-admin-user-subscription";
import { useAdminUserSessions } from "@/entities/admin-user/model/use-admin-user-sessions";
import { useAdminUserFeatureFlags } from "@/entities/admin-user/model/use-admin-user-feature-flags";
import { useAdminUserMutations } from "@/entities/admin-user";
import type { FetchUserEventsQuery, UserEventType } from "@/entities/admin-user";

export type EventsTab = "feed" | "summary" | "sessions";

export const useAdminUserDetailPage = (userId: string) => {
	const [eventsTab, setEventsTab] = useState<EventsTab>("feed");
	const [eventsFilter, setEventsFilter] = useState<FetchUserEventsQuery>({
		page: 1,
		limit: 25,
	});

	const detail = useAdminUserDetail(userId);
	const roles = useAdminUserRoles(userId);
	const events = useAdminUserEvents(userId, eventsFilter);
	const eventsSummary = useAdminUserEventsSummary(userId);
	const subscription = useAdminUserSubscription(userId);
	const sessions = useAdminUserSessions(userId);
	const featureFlags = useAdminUserFeatureFlags(userId);
	const mutations = useAdminUserMutations();

	const handleEventTypeChange = useCallback((type: UserEventType | "") => {
		setEventsFilter((prev) => ({ ...prev, type: type || undefined, page: 1 }));
	}, []);

	const handleEventPeriodChange = useCallback(
		(period: FetchUserEventsQuery["period"]) => {
			setEventsFilter((prev) => ({ ...prev, period, page: 1 }));
		},
		[],
	);

	const handleEventsLoadMore = useCallback(() => {
		setEventsFilter((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }));
	}, []);

	return {
		detail,
		roles,
		events,
		eventsSummary,
		subscription,
		sessions,
		featureFlags,
		mutations,
		eventsTab,
		setEventsTab,
		eventsFilter,
		handleEventTypeChange,
		handleEventPeriodChange,
		handleEventsLoadMore,
	};
};
