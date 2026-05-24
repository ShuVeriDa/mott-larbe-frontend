import { API_URL } from "@/shared/config";
import { http } from "@/shared/api";
import type {
	AnalyticsAggregateResult,
	AnalyticsGeographyExportQuery,
	AnalyticsGeographyStats,
	AnalyticsGeographyStatsQuery,
	AnalyticsGeoIpStatus,
	AnalyticsMultiTimeseries,
	AnalyticsMultiTimeseriesQuery,
	AnalyticsOverview,
	AnalyticsOverviewExportQuery,
	AnalyticsPageItem,
	AnalyticsPagesExportQuery,
	AnalyticsPagesQuery,
	AnalyticsPagesResponse,
	AnalyticsLiveEvent,
	AnalyticsRealtime,
	AnalyticsRealtimeRaw,
	AnalyticsRecentQuery,
	AnalyticsReferrersBreakdown,
	AnalyticsReferrersBreakdownQuery,
	AnalyticsTimeseriesCompareResponse,
	AnalyticsTimeseriesPoint,
	AnalyticsTimeseriesQuery,
	AnalyticsTimeseriesSummary,
	AnalyticsTopCitiesQuery,
	AnalyticsTopCityItem,
	AnalyticsTopCountriesQuery,
	AnalyticsTopCountryItem,
	AnalyticsTopQuery,
	AnalyticsTopReferrerItem,
	AnalyticsTopReferrersQuery,
	AnalyticsUaBreakdown,
	AnalyticsUaKind,
	AnalyticsUaQuery,
	AnalyticsWordClickItem,
	AnalyticsWordClicksQuery,
} from "./types";

const BASE = "/admin/tracking";

const UA_KIND_PATH: Record<AnalyticsUaKind, string> = {
	device: `${BASE}/devices`,
	browser: `${BASE}/browsers`,
	os: `${BASE}/os`,
};

const buildTimeseriesParams = (
	query: AnalyticsTimeseriesQuery,
	extra: Record<string, string> = {},
): Record<string, string> => {
	const params: Record<string, string> = {
		metric: query.metric,
		granularity: query.granularity,
		...extra,
	};
	if (query.from) params.from = query.from;
	if (query.to) params.to = query.to;
	return params;
};

const buildRangeParams = (from?: string, to?: string): Record<string, string> => {
	const params: Record<string, string> = {};
	if (from) params.from = from;
	if (to) params.to = to;
	return params;
};

const buildPagesParams = (query: AnalyticsPagesQuery): Record<string, string | number> => {
	const params: Record<string, string | number> = {};
	if (query.from) params.from = query.from;
	if (query.to) params.to = query.to;
	if (query.search?.trim()) params.search = query.search.trim();
	if (typeof query.limit === "number") params.limit = query.limit;
	if (typeof query.offset === "number") params.offset = query.offset;
	return params;
};

export const adminAnalyticsApi = {
	async getRealtime(): Promise<AnalyticsRealtime> {
		const { data } = await http.get<AnalyticsRealtimeRaw>(`${BASE}/realtime`);
		return {
			count: data.realtimeVisitors,
			queueSize: data.queueSize,
			eventsPerMinute: data.eventsPerMinute,
		};
	},

	async getRecent(query: AnalyticsRecentQuery = {}): Promise<AnalyticsLiveEvent[]> {
		const params: Record<string, string | number> = {};
		if (typeof query.limit === "number") params.limit = query.limit;
		if (query.sinceId) params.sinceId = query.sinceId;
		if (query.eventType) {
			params.eventType = Array.isArray(query.eventType)
				? query.eventType.join(",")
				: query.eventType;
		}
		const { data } = await http.get<AnalyticsLiveEvent[]>(`${BASE}/recent`, { params });
		return data;
	},

	async listPages(query: AnalyticsPagesQuery): Promise<AnalyticsPagesResponse> {
		const { data } = await http.get<AnalyticsPagesResponse>(`${BASE}/pages`, {
			params: buildPagesParams(query),
		});
		return data;
	},

	async getTimeseries(query: AnalyticsTimeseriesQuery): Promise<AnalyticsTimeseriesPoint[]> {
		const { data } = await http.get<AnalyticsTimeseriesPoint[]>(`${BASE}/timeseries`, {
			params: buildTimeseriesParams(query),
		});
		return data;
	},

	async getTimeseriesWithCompare(query: AnalyticsTimeseriesQuery): Promise<AnalyticsTimeseriesCompareResponse> {
		const { data } = await http.get<AnalyticsTimeseriesCompareResponse>(`${BASE}/timeseries`, {
			params: buildTimeseriesParams(query, { compare: "true" }),
		});
		return data;
	},

	async getTimeseriesSummary(query: AnalyticsTimeseriesQuery): Promise<AnalyticsTimeseriesSummary> {
		const { data } = await http.get<AnalyticsTimeseriesSummary>(`${BASE}/timeseries/summary`, {
			params: buildTimeseriesParams(query),
		});
		return data;
	},

	async getOverview(from?: string, to?: string): Promise<AnalyticsOverview> {
		const { data } = await http.get<AnalyticsOverview>(`${BASE}/overview`, {
			params: buildRangeParams(from, to),
		});
		return data;
	},

	buildTimeseriesExportUrl(query: AnalyticsTimeseriesQuery): string {
		const params = new URLSearchParams(buildTimeseriesParams(query));
		return `${API_URL}${BASE}/timeseries/export?${params.toString()}`;
	},

	async getMultiTimeseries(query: AnalyticsMultiTimeseriesQuery): Promise<AnalyticsMultiTimeseries> {
		const params: Record<string, string> = { metrics: query.metrics.join(",") };
		if (query.granularity) params.granularity = query.granularity;
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		const { data } = await http.get<AnalyticsMultiTimeseries>(`${BASE}/timeseries/multi`, { params });
		return data;
	},

	async getTopPages(query: AnalyticsTopQuery): Promise<AnalyticsPageItem[]> {
		const params: Record<string, string | number> = {};
		if (query.limit !== undefined) params.limit = query.limit;
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		const { data } = await http.get<AnalyticsPageItem[]>(`${BASE}/top-pages`, { params });
		return data;
	},

	async listTopReferrers(query: AnalyticsTopReferrersQuery): Promise<AnalyticsTopReferrerItem[]> {
		const params: Record<string, string | number> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (typeof query.limit === "number") params.limit = query.limit;
		if (typeof query.offset === "number") params.offset = query.offset;
		if (query.category) params.category = query.category;
		const { data } = await http.get<AnalyticsTopReferrerItem[]>(`${BASE}/top-referrers`, { params });
		return data;
	},

	async getReferrersBreakdown(query: AnalyticsReferrersBreakdownQuery): Promise<AnalyticsReferrersBreakdown> {
		const params: Record<string, string> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		const { data } = await http.get<AnalyticsReferrersBreakdown>(`${BASE}/referrers/breakdown`, { params });
		return data;
	},

	async aggregate(day?: string): Promise<AnalyticsAggregateResult> {
		const params: Record<string, string> = {};
		if (day) params.day = day;
		const { data } = await http.post<AnalyticsAggregateResult>(`${BASE}/aggregate`, null, { params });
		return data;
	},

	async getUaBreakdown(kind: AnalyticsUaKind, query: AnalyticsUaQuery): Promise<AnalyticsUaBreakdown> {
		const { data } = await http.get<AnalyticsUaBreakdown>(UA_KIND_PATH[kind], {
			params: buildRangeParams(query.from, query.to),
		});
		return data;
	},

	async getOverviewExport(query: AnalyticsOverviewExportQuery): Promise<Blob> {
		const { data } = await http.get<Blob>(`${BASE}/overview/export`, {
			params: buildRangeParams(query.from, query.to),
			responseType: "blob",
		});
		return data;
	},

	async getGeoIpStatus(): Promise<AnalyticsGeoIpStatus> {
		const { data } = await http.get<AnalyticsGeoIpStatus>(`${BASE}/geography/status`);
		return data;
	},

	async getTopCountries(query: AnalyticsTopCountriesQuery): Promise<AnalyticsTopCountryItem[]> {
		const params: Record<string, string | number> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (typeof query.limit === "number") params.limit = query.limit;
		const { data } = await http.get<AnalyticsTopCountryItem[]>(`${BASE}/top-countries`, { params });
		return data;
	},

	async getTopCities(query: AnalyticsTopCitiesQuery): Promise<AnalyticsTopCityItem[]> {
		const params: Record<string, string | number> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (typeof query.limit === "number") params.limit = query.limit;
		if (query.country) params.country = query.country;
		const { data } = await http.get<AnalyticsTopCityItem[]>(`${BASE}/top-cities`, { params });
		return data;
	},

	async getGeographyStats(query: AnalyticsGeographyStatsQuery): Promise<AnalyticsGeographyStats> {
		const { data } = await http.get<AnalyticsGeographyStats>(`${BASE}/geography/stats`, {
			params: buildRangeParams(query.from, query.to),
		});
		return data;
	},

	async exportGeographyCsv(query: AnalyticsGeographyExportQuery): Promise<Blob> {
		const params: Record<string, string> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (query.level) params.level = query.level;
		if (query.country) params.country = query.country;
		const { data } = await http.get<Blob>(`${BASE}/geography/export`, {
			params,
			responseType: "blob",
		});
		return data;
	},

	async getTopWordClicks(query: AnalyticsWordClicksQuery): Promise<AnalyticsWordClickItem[]> {
		const params: Record<string, string | number> = {};
		if (query.from) params.from = query.from;
		if (query.to) params.to = query.to;
		if (typeof query.limit === "number") params.limit = query.limit;
		const { data } = await http.get<AnalyticsWordClickItem[]>(`${BASE}/word-clicks`, { params });
		return data;
	},
};
