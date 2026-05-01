import type { FetchAdminUsersQuery } from "./types";

export const adminUserKeys = {
	root: ["admin", "users"] as const,
	list: (query: FetchAdminUsersQuery) =>
		["admin", "users", "list", query] as const,
	stats: () => ["admin", "users", "stats"] as const,
};
