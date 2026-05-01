export const dashboardKeys = {
	root: ["dashboard"] as const,
	me: () => ["dashboard", "me"] as const,
};
