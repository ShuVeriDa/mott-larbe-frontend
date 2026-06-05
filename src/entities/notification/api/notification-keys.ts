export const notificationKeys = {
	all: ["entities", "notification"] as const,
	list: () => [...notificationKeys.all, "list"] as const,
	unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};
