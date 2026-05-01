import type { PaymentsQuery } from "./types";

export const subscriptionKeys = {
	root: ["subscription"] as const,
	plans: () => ["subscription", "plans"] as const,
	me: () => ["subscription", "me"] as const,
	usage: () => ["subscription", "usage"] as const,
	payments: (query: PaymentsQuery = {}) =>
		["subscription", "payments", query] as const,
};
