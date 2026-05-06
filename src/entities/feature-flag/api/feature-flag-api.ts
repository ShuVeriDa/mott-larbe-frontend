import { http } from "@/shared/api";
import type {
	CreateFeatureFlagDto,
	CreateFeatureFlagOverrideDto,
	FeatureFlagHistoryActorsResult,
	FeatureFlagHistoryItem,
	FeatureFlagItem,
	FeatureFlagKeysResult,
	FeatureFlagStats,
	GetFeatureFlagHistoryQuery,
	GetFeatureFlagKeysQuery,
	GetFeatureFlagOverridesQuery,
	GetFeatureFlagsQuery,
	ImportFeatureFlagsDto,
	ImportFeatureFlagsResult,
	PaginatedFeatureFlagHistory,
	PaginatedFeatureFlagOverrides,
	PaginatedFeatureFlags,
	UpdateFeatureFlagDto,
} from "./types";

export const featureFlagApi = {
	getStats: (): Promise<FeatureFlagStats> =>
		http.get<FeatureFlagStats>("/admin/feature-flags/stats").then((r) => r.data),

	getFlags: (query: GetFeatureFlagsQuery = {}): Promise<PaginatedFeatureFlags> => {
		const params: Record<string, unknown> = { page: query.page ?? 1, limit: query.limit ?? 25 };
		if (query.search) params.search = query.search;
		if (query.category) params.category = query.category;
		if (query.environment) params.environment = query.environment;
		if (query.status) params.status = query.status;
		return http.get<PaginatedFeatureFlags>("/admin/feature-flags", { params }).then((r) => r.data);
	},

	createFlag: (dto: CreateFeatureFlagDto): Promise<FeatureFlagItem> =>
		http.post<FeatureFlagItem>("/admin/feature-flags", dto).then((r) => r.data),

	updateFlag: (id: string, dto: UpdateFeatureFlagDto): Promise<FeatureFlagItem> =>
		http.patch<FeatureFlagItem>(`/admin/feature-flags/${id}`, dto).then((r) => r.data),

	toggleFlag: (id: string, isEnabled: boolean): Promise<FeatureFlagItem> =>
		http
			.patch<FeatureFlagItem>(`/admin/feature-flags/${id}/toggle`, { isEnabled })
			.then((r) => r.data),

	deleteFlag: (id: string): Promise<true> =>
		http.delete<true>(`/admin/feature-flags/${id}`).then((r) => r.data),

	duplicateFlag: (id: string, key: string): Promise<FeatureFlagItem> =>
		http
			.post<FeatureFlagItem>(`/admin/feature-flags/${id}/duplicate`, { key })
			.then((r) => r.data),

	getOverrides: (query: GetFeatureFlagOverridesQuery = {}): Promise<PaginatedFeatureFlagOverrides> => {
		const params: Record<string, unknown> = { page: query.page ?? 1, limit: query.limit ?? 25 };
		if (query.search) params.search = query.search;
		if (query.flagId) params.flagId = query.flagId;
		if (query.isEnabled !== undefined) params.isEnabled = query.isEnabled;
		return http
			.get<PaginatedFeatureFlagOverrides>("/admin/feature-flags/overrides", { params })
			.then((r) => r.data);
	},

	deleteOverride: (overrideId: string): Promise<true> =>
		http
			.delete<true>(`/admin/feature-flags/overrides/${overrideId}`)
			.then((r) => r.data),

	getHistory: (query: GetFeatureFlagHistoryQuery = {}): Promise<PaginatedFeatureFlagHistory> => {
		const params: Record<string, unknown> = { page: query.page ?? 1, limit: query.limit ?? 25 };
		if (query.search) params.search = query.search;
		if (query.flagId) params.flagId = query.flagId;
		if (query.actorId) params.actorId = query.actorId;
		if (query.eventType) params.eventType = query.eventType;
		return http
			.get<PaginatedFeatureFlagHistory>("/admin/feature-flags/history", { params })
			.then((r) => r.data);
	},

	getFlagHistory: (id: string, limit = 20): Promise<FeatureFlagHistoryItem[]> =>
		http
			.get<FeatureFlagHistoryItem[]>(`/admin/feature-flags/${id}/history`, { params: { limit } })
			.then((r) => r.data),

	getKeys: (query: GetFeatureFlagKeysQuery = {}): Promise<FeatureFlagKeysResult> => {
		const params: Record<string, unknown> = {};
		if (query.search) params.search = query.search;
		if (query.includeDeleted) params.includeDeleted = query.includeDeleted;
		if (query.limit) params.limit = query.limit;
		return http.get<FeatureFlagKeysResult>("/admin/feature-flags/keys", { params }).then((r) => r.data);
	},

	getHistoryActors: (): Promise<FeatureFlagHistoryActorsResult> =>
		http
			.get<FeatureFlagHistoryActorsResult>("/admin/feature-flags/history/actors")
			.then((r) => r.data),

	createOverride: (dto: CreateFeatureFlagOverrideDto): Promise<unknown> =>
		http.post("/admin/feature-flags/overrides", dto).then((r) => r.data),

	importFlags: (dto: ImportFeatureFlagsDto): Promise<ImportFeatureFlagsResult> =>
		http.post<ImportFeatureFlagsResult>("/admin/feature-flags/import", dto).then((r) => r.data),
};
