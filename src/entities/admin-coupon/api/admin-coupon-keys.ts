import type { FetchCouponsQuery } from "./types";

export const adminCouponKeys = {
	root: ["admin", "coupons"] as const,
	stats: () => ["admin", "coupons", "stats"] as const,
	list: (query: FetchCouponsQuery = {}) => ["admin", "coupons", "list", query] as const,
	detail: (id: string) => ["admin", "coupons", "detail", id] as const,
};
