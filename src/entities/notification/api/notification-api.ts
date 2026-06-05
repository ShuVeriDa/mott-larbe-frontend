import { http } from "@/shared/api";
import type { Notification, UnreadCountResponse } from "../model/types";

export const notificationApi = {
	getList: (limit = 20) =>
		http
			.get<Notification[]>("/notifications", { params: { limit } })
			.then((r) => r.data),

	getUnreadCount: () =>
		http
			.get<UnreadCountResponse>("/notifications/unread-count")
			.then((r) => r.data),

	markRead: (id: string) =>
		http.patch(`/notifications/${id}/read`).then((r) => r.data),

	markAllRead: () =>
		http.patch("/notifications/read-all").then((r) => r.data),
};
