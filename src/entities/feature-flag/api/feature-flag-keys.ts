import type {
	GetFeatureFlagHistoryQuery,
	GetFeatureFlagOverridesQuery,
	GetFeatureFlagsQuery,
} from "./types";

export const featureFlagKeys = {
	root: ["feature-flags"] as const,
	stats: () => ["feature-flags", "stats"] as const,
	list: (query: GetFeatureFlagsQuery = {}) => ["feature-flags", "list", query] as const,
	overrides: (query: GetFeatureFlagOverridesQuery = {}) =>
		["feature-flags", "overrides", query] as const,
	history: (query: GetFeatureFlagHistoryQuery = {}) =>
		["feature-flags", "history", query] as const,
};
