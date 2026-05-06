import type { FetchPaymentChartQuery, FetchPaymentsQuery } from "./types";

export const adminPaymentKeys = {
	root: ["admin", "payments"] as const,
	stats: () => ["admin", "payments", "stats"] as const,
	chart: (query: FetchPaymentChartQuery = {}) =>
		["admin", "payments", "chart", query] as const,
	providers: () => ["admin", "payments", "providers"] as const,
	list: (query: FetchPaymentsQuery = {}) =>
		["admin", "payments", "list", query] as const,
	detail: (id: string) => ["admin", "payments", "detail", id] as const,
};
