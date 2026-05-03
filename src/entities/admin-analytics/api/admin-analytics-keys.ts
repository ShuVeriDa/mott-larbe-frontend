import type { FetchAdminAnalyticsQuery, DifficultBy, PopularBy } from "./types";

export const adminAnalyticsKeys = {
	root: ["admin", "analytics"] as const,
	overview: (query?: FetchAdminAnalyticsQuery) =>
		[...adminAnalyticsKeys.root, "overview", query] as const,
	difficultTexts: (query?: { range?: string; difficultBy?: DifficultBy }) =>
		[...adminAnalyticsKeys.root, "difficult-texts", query] as const,
	popularTexts: (query?: { range?: string; popularBy?: PopularBy }) =>
		[...adminAnalyticsKeys.root, "popular-texts", query] as const,
};
