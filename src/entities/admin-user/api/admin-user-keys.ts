import type { FetchAdminUsersQuery, FetchUserEventsQuery } from "./types";

export const adminUserKeys = {
	root: ["admin", "users"] as const,
	list: (query: FetchAdminUsersQuery) =>
		["admin", "users", "list", query] as const,
	stats: () => ["admin", "users", "stats"] as const,
	detail: (id: string) => ["admin", "users", id] as const,
	roles: (id: string) => ["admin", "users", id, "roles"] as const,
	events: (id: string, query: FetchUserEventsQuery) =>
		["admin", "users", id, "events", query] as const,
	eventsSummary: (id: string) => ["admin", "users", id, "events", "summary"] as const,
	subscription: (id: string) => ["admin", "users", id, "subscription"] as const,
	sessions: (id: string) => ["admin", "users", id, "sessions"] as const,
	featureFlags: (id: string) => ["admin", "users", id, "feature-flags"] as const,
};
