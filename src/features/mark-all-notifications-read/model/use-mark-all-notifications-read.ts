"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	notificationApi,
	notificationKeys,
	type Notification,
	type UnreadCountResponse,
} from "@/entities/notification";

export const useMarkAllNotificationsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => notificationApi.markAllRead(),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
			await queryClient.cancelQueries({
				queryKey: notificationKeys.unreadCount(),
			});
			const previousList = queryClient.getQueryData<Notification[]>(
				notificationKeys.list(),
			);
			const previousCount = queryClient.getQueryData<UnreadCountResponse>(
				notificationKeys.unreadCount(),
			);
			queryClient.setQueryData<Notification[]>(notificationKeys.list(), (old) =>
				old?.map((n) => ({ ...n, isRead: true })),
			);
			queryClient.setQueryData<UnreadCountResponse>(
				notificationKeys.unreadCount(),
				{ count: 0 },
			);
			return { previousList, previousCount };
		},
		onError: (_err, _vars, context) => {
			if (context?.previousList) {
				queryClient.setQueryData(notificationKeys.list(), context.previousList);
			}
			if (context?.previousCount) {
				queryClient.setQueryData(
					notificationKeys.unreadCount(),
					context.previousCount,
				);
			}
		},
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
			void queryClient.invalidateQueries({
				queryKey: notificationKeys.unreadCount(),
			});
		},
	});
};
