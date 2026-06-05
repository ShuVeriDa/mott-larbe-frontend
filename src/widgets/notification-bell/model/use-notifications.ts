"use client";

import {
	notificationListQueryOptions,
	notificationUnreadCountQueryOptions,
} from "@/entities/notification";
import { useQuery } from "@tanstack/react-query";

export const useNotifications = () => {
	const { data: notifications = [], isLoading: isListLoading } = useQuery(
		notificationListQueryOptions(),
	);

	const { data: unreadCountData, isLoading: isCountLoading } = useQuery(
		notificationUnreadCountQueryOptions(),
	);

	return {
		notifications,
		unreadCount: unreadCountData?.count ?? 0,
		isLoading: isListLoading || isCountLoading,
	};
};
