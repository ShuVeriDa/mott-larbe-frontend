import type {
	GetFeatureFlagHistoryQuery,
	GetFeatureFlagKeysQuery,
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
	keys: (query: GetFeatureFlagKeysQuery = {}) => ["feature-flags", "keys", query] as const,
	historyActors: () => ["feature-flags", "history-actors"] as const,
	flagHistory: (id: string) => ["feature-flags", "flag-history", id] as const,
};
