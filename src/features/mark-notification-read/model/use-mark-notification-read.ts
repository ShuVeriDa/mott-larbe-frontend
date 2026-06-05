"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	notificationApi,
	notificationKeys,
	type Notification,
} from "@/entities/notification";

export const useMarkNotificationRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => notificationApi.markRead(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: notificationKeys.list() });
			const previousList = queryClient.getQueryData<Notification[]>(
				notificationKeys.list(),
			);
			queryClient.setQueryData<Notification[]>(notificationKeys.list(), (old) =>
				old?.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
			);
			return { previousList };
		},
		onError: (_err, _id, context) => {
			if (context?.previousList) {
				queryClient.setQueryData(notificationKeys.list(), context.previousList);
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
