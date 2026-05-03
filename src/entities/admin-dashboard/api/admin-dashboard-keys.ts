import type { DashboardQueryParams } from "./types";

export const adminDashboardKeys = {
	root: ["admin-dashboard"] as const,
	detail: (query: DashboardQueryParams = {}) => ["admin-dashboard", query] as const,
};
