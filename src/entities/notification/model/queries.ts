import { queryOptions } from "@tanstack/react-query";
import { notificationApi } from "../api/notification-api";
import { notificationKeys } from "../api/notification-keys";

export const notificationListQueryOptions = (limit = 20) =>
	queryOptions({
		queryKey: notificationKeys.list(),
		queryFn: () => notificationApi.getList(limit),
		staleTime: 1000 * 30,
	});

export const notificationUnreadCountQueryOptions = () =>
	queryOptions({
		queryKey: notificationKeys.unreadCount(),
		queryFn: () => notificationApi.getUnreadCount(),
		staleTime: 1000 * 30,
	});
