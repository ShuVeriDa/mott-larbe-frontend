"use client";
import { useState } from 'react';
import { useAdminUserDetail, useAdminUserRoles, useAdminUserEvents, useAdminUserEventsSummary, useAdminUserSubscription, useAdminUserSessions, useAdminUserFeatureFlags, useAdminUserMutations } from "@/entities/admin-user";
import { useAdminSubscriptionMutations } from "@/entities/admin-subscription";
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
	const subscriptionMutations = useAdminSubscriptionMutations();

	const handleEventTypeChange = (type: UserEventType | "") => {
		setEventsFilter((prev) => ({ ...prev, type: type || undefined, page: 1 }));
	};

	const handleEventPeriodChange = (period: FetchUserEventsQuery["period"]) => {
		setEventsFilter((prev) => ({ ...prev, period, page: 1 }));
	};

	const handleEventsLoadMore = () => {
		setEventsFilter((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }));
	};

	return {
		detail,
		roles,
		events,
		eventsSummary,
		subscription,
		sessions,
		featureFlags,
		mutations,
		subscriptionMutations,
		eventsTab,
		setEventsTab,
		eventsFilter,
		handleEventTypeChange,
		handleEventPeriodChange,
		handleEventsLoadMore,
	};
};
