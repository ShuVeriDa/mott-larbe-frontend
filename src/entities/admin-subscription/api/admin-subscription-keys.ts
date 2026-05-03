import type { FetchSubscriptionsQuery } from "./types";

export const adminSubscriptionKeys = {
	root: ["admin", "subscriptions"] as const,
	list: (query: FetchSubscriptionsQuery) =>
		["admin", "subscriptions", "list", query] as const,
	stats: () => ["admin", "subscriptions", "stats"] as const,
	detail: (id: string) => ["admin", "subscriptions", id] as const,
};
