// ===== Range / presets =====

export type AnalyticsRangePreset = "today" | "7d" | "30d" | "90d" | "custom";

export interface AnalyticsRange {
	from: string; // YYYY-MM-DD
	to: string; // YYYY-MM-DD
}

export type AnalyticsRangeError = "fromAfterTo" | null;

export interface AnalyticsRangeState {
	range: AnalyticsRange;
	preset: AnalyticsRangePreset;
	setPreset: (preset: AnalyticsRangePreset) => void;
	setCustomRange: (patch: Partial<AnalyticsRange>) => void;
	error: AnalyticsRangeError;
}

// ===== Granularity / metric =====

export type AnalyticsGranularity = "day" | "week" | "month";

export type AnalyticsMetric =
	| "uniqueVisitors"
	| "sessions"
	| "pageviews"
	| "totalEvents"
	| "avgSessionSec"
	| "bounceRate";

// ===== Realtime =====

export interface AnalyticsRealtimeRaw {
	realtimeVisitors: number;
	queueSize: number;
	eventsPerMinute: number;
}

export interface AnalyticsRealtime {
	count: number;
	queueSize: number;
	eventsPerMinute: number;
}

// ===== Pages list =====

export interface AnalyticsPagesQuery {
	from?: string;
	to?: string;
	search?: string;
	limit?: number;
	offset?: number;
}

export interface AnalyticsPageItem {
	key: string;
	count: number;
}

export interface AnalyticsPagesResponse {
	items: AnalyticsPageItem[];
	total: number;
	limit: number;
	offset: number;
}

// ===== Pages stats =====

export interface AnalyticsPagesStatsQuery {
	from?: string;
	to?: string;
}

export interface AnalyticsPagesStats {
	range: { from: string; to: string };
	distinctUrls: number;
	top80pctUrls: number;
	medianViewsPerUrl: number;
	totalPageviews: number;
	periodDays: number;
}

export interface AnalyticsPagesExportQuery {
	from?: string;
	to?: string;
	search?: string;
}

// ===== Timeseries =====

export interface AnalyticsTimeseriesQuery {
	metric: AnalyticsMetric;
	granularity: AnalyticsGranularity;
	from?: string;
	to?: string;
}

export interface AnalyticsTimeseriesPoint {
	date: string;
	value: number;
}

export interface AnalyticsRangeBoundary {
	from: string;
	to: string;
}

export interface AnalyticsTimeseriesCompareResponse {
	range: AnalyticsRangeBoundary;
	previousRange: AnalyticsRangeBoundary;
	current: AnalyticsTimeseriesPoint[];
	previous: AnalyticsTimeseriesPoint[];
}

export interface AnalyticsTimeseriesSummary {
	range: AnalyticsRangeBoundary;
	points: number;
	total: number;
	avg: number;
	peak: { date: string; value: number } | null;
	min: { date: string; value: number } | null;
	distinctTotal?: number;
}

// ===== Overview =====

export interface AnalyticsOverviewMetrics {
	uniqueVisitors: number;
	uniqueVisitorsByDaySum?: number;
	sessions: number;
	pageviews: number;
	totalEvents: number;
	avgSessionSec: number;
	bounceRate: number;
	daysWithData?: number;
}

export interface AnalyticsAggregatorStatus {
	lastRunAt: string | null;
	isHealthy: boolean;
}

export interface AnalyticsOverview {
	range: AnalyticsRangeBoundary;
	previousRange: AnalyticsRangeBoundary;
	current: AnalyticsOverviewMetrics;
	previous: AnalyticsOverviewMetrics;
	realtimeVisitors?: number;
	queueSize?: number;
	aggregator?: AnalyticsAggregatorStatus;
}

export type AnalyticsCounters = AnalyticsOverviewMetrics;
export type AnalyticsTopItem = AnalyticsPageItem;

export interface AnalyticsRangeQuery {
	from?: string;
	to?: string;
}

export interface AnalyticsTopQuery extends AnalyticsRangeQuery {
	limit?: number;
}

export interface AnalyticsMultiTimeseriesQuery extends AnalyticsRangeQuery {
	metrics: AnalyticsMetric[];
	granularity?: AnalyticsGranularity;
}

export type AnalyticsMultiTimeseries = Partial<
	Record<AnalyticsMetric, AnalyticsTimeseriesPoint[]>
>;

export interface AnalyticsAggregateResult {
	aggregated: string;
}

export interface AnalyticsOverviewExportQuery {
	from?: string;
	to?: string;
}

// ===== Referrers =====

export type AnalyticsReferrerCategory =
	| "search"
	| "direct"
	| "social"
	| "other";

export const REFERRER_CATEGORIES: ReadonlyArray<AnalyticsReferrerCategory> = [
	"search",
	"direct",
	"social",
	"other",
];

export const DIRECT_REFERRER_KEY = "(direct)";

export interface AnalyticsTopReferrerItem {
	key: string;
	count: number;
	category: AnalyticsReferrerCategory;
}

export interface AnalyticsTopReferrersQuery {
	from?: string;
	to?: string;
	limit?: number;
	offset?: number;
	category?: AnalyticsReferrerCategory;
}

export interface AnalyticsReferrerCategoryStats {
	count: number;
	share: number;
	sampleHosts: string[];
}

export type AnalyticsReferrersByCategory = Record<
	AnalyticsReferrerCategory,
	AnalyticsReferrerCategoryStats
>;

export interface AnalyticsReferrersBreakdown {
	range: AnalyticsRangeBoundary;
	total: number;
	uniqueHosts: number;
	byCategory: AnalyticsReferrersByCategory;
}

export interface AnalyticsReferrersBreakdownQuery extends AnalyticsRangeQuery {}

// ===== User-Agent breakdown =====

export type AnalyticsUaKind = "device" | "browser" | "os";

export interface AnalyticsUaItem {
	key: string;
	events: number;
	visitors: number;
	share: number;
}

export interface AnalyticsUaBreakdown {
	range: AnalyticsRangeBoundary;
	totalEvents: number;
	totalVisitors: number;
	items: AnalyticsUaItem[];
}

export interface AnalyticsUaQuery extends AnalyticsRangeQuery {}

// ===== Geography =====

export interface AnalyticsGeoIpStatusRecent {
	windowDays: number;
	totalEvents: number;
	eventsWithCountry: number;
	coverage: number;
}

export interface AnalyticsGeoIpStatus {
	configured: boolean;
	databasePath: string | null;
	databaseExists: boolean;
	databaseType: string | null;
	supportsCity: boolean;
	loadedAt: string | null;
	fileSize: number | null;
	buildEpoch: string | null;
	recent: AnalyticsGeoIpStatusRecent;
}

export interface AnalyticsTopCountriesQuery extends AnalyticsRangeQuery {
	limit?: number;
}

export interface AnalyticsTopCountryItem {
	key: string;
	count: number;
}

export interface AnalyticsTopCitiesQuery extends AnalyticsRangeQuery {
	limit?: number;
	country?: string;
}

export interface AnalyticsTopCityItem {
	key: string;
	country: string | null;
	count: number;
}

export interface AnalyticsGeographyStatsQuery extends AnalyticsRangeQuery {}

export interface AnalyticsGeographyStats {
	totalEvents: number;
	eventsWithCountry: number;
	eventsWithCity: number;
	uniqueCountries: number;
	uniqueCities: number;
	topCountry: string | null;
	topCity: string | null;
}

export type AnalyticsGeographyExportLevel = "country" | "city";

export interface AnalyticsGeographyExportQuery extends AnalyticsRangeQuery {
	level?: AnalyticsGeographyExportLevel;
	country?: string;
}

// ===== Live feed =====

export const LIVE_EVENT_TYPES = [
	"pageview",
	"text_open",
	"text_finish",
	"word_click",
	"word_add_dict",
	"word_dismiss",
	"ai_translation",
	"search",
] as const;

export type AnalyticsLiveEventType = (typeof LIVE_EVENT_TYPES)[number];

export interface AnalyticsLiveEventUser {
	id: string;
	username: string | null;
	name: string | null;
	avatar: string | null;
}

export interface AnalyticsLiveEventMetadata {
	tokenId?: string;
	word?: string | null;
	textId?: string | null;
	title?: string | null;
	[key: string]: unknown;
}

export interface AnalyticsLiveEvent {
	id: string;
	eventType: string;
	path: string | null;
	referrer: string | null;
	device: string | null;
	browser: string | null;
	os: string | null;
	country: string | null;
	userId: string | null;
	user: AnalyticsLiveEventUser | null;
	metadata: AnalyticsLiveEventMetadata | null;
	createdAt: string;
}

export interface AnalyticsRecentQuery {
	limit?: number;
	sinceId?: string;
	eventType?: AnalyticsLiveEventType | AnalyticsLiveEventType[];
}

// ===== Word clicks (reader-specific) =====

export interface AnalyticsWordClickItem {
	word: string;
	count: number;
}

export interface AnalyticsWordClicksQuery extends AnalyticsRangeQuery {
	limit?: number;
}
