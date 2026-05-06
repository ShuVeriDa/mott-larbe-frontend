import type { FetchPlansQuery, FetchSubscriptionsQuery, FetchCouponsQuery } from "./types";

export const adminBillingKeys = {
	root: ["admin", "billing"] as const,
	stats: () => ["admin", "billing", "stats"] as const,
	revenue: () => ["admin", "billing", "revenue"] as const,
	plans: (query: FetchPlansQuery = {}) => ["admin", "plans", query] as const,
	subscriptionStats: () => ["admin", "subscriptions", "stats"] as const,
	subscriptions: (query: FetchSubscriptionsQuery = {}) =>
		["admin", "subscriptions", query] as const,
	coupons: (query: FetchCouponsQuery = {}) => ["admin", "coupons", query] as const,
};
