import type { GetFeedbackDto } from "./types";

export const feedbackKeys = {
	root: ["feedback"] as const,
	list: (query: GetFeedbackDto = {}) =>
		["feedback", "list", query] as const,
	thread: (id: string) => ["feedback", "thread", id] as const,
	unreadCount: () => ["feedback", "unread-count"] as const,
};
