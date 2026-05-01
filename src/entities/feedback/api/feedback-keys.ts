import type { GetFeedbackDto } from "./types";

export const feedbackKeys = {
	root: ["feedback"] as const,
	list: (query: GetFeedbackDto = {}) =>
		["feedback", "list", query] as const,
	detail: (id: string) => ["feedback", "detail", id] as const,
	unreadCount: () => ["feedback", "unread-count"] as const,
};
