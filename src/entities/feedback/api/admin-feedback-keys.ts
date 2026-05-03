import type { GetAdminFeedbackDto } from "./admin-types";

export const adminFeedbackKeys = {
	root: ["admin-feedback"] as const,
	list: (query: GetAdminFeedbackDto = {}) =>
		["admin-feedback", "list", query] as const,
	detail: (id: string) => ["admin-feedback", "detail", id] as const,
	stats: () => ["admin-feedback", "stats"] as const,
	assignees: () => ["admin-feedback", "assignees"] as const,
};
