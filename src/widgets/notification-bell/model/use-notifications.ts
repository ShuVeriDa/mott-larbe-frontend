"use client";

import {
	notificationListQueryOptions,
	notificationUnreadCountQueryOptions,
	type Notification,
} from "@/entities/notification";
import { settingsKeys, type AllSettings } from "@/entities/settings";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const filterByPrefs = (
	notifications: Notification[],
	settings: AllSettings | undefined,
): Notification[] => {
	if (!settings) return notifications;
	const { inAppFeedbackReply, inAppSuggestion, inAppTextSubmission } =
		settings.notifications;
	return notifications.filter((n) => {
		if (n.type === "FEEDBACK_REPLY") return inAppFeedbackReply;
		if (n.type === "SUGGESTION_APPROVED" || n.type === "SUGGESTION_REJECTED")
			return inAppSuggestion;
		if (
			n.type === "TEXT_SUBMISSION_APPROVED" ||
			n.type === "TEXT_SUBMISSION_REJECTED"
		)
			return inAppTextSubmission;
		if (n.type === "NEW_LIBRARY_TEXT")
			return settings.notifications.inAppNewTexts ?? true;
		if (n.type === "PLATFORM_ANNOUNCEMENT") return true;
		return true;
	});
};

export const useNotifications = () => {
	const qc = useQueryClient();

	const { data: rawNotifications = [], isPending: isListPending } = useQuery(
		notificationListQueryOptions(),
	);

	const { data: unreadCountData, isPending: isCountPending } = useQuery(
		notificationUnreadCountQueryOptions(),
	);

	const settings = qc.getQueryData<AllSettings>(settingsKeys.all());
	const notifications = filterByPrefs(rawNotifications, settings);

	return {
		notifications,
		unreadCount: unreadCountData?.count ?? 0,
		isLoading: isListPending || isCountPending,
	};
};
