import type { StatisticsQuery } from "./types";

export const statisticsKeys = {
	root: ["statistics"] as const,
	me: (query: StatisticsQuery) => ["statistics", "me", query] as const,
};
