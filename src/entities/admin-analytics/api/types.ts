import type { CefrLevel } from "@/shared/types";

export type AnalyticsRange = "7d" | "30d" | "90d" | "all";
export type DifficultBy = "fail" | "pct" | "abandon";
export type PopularBy = "opens" | "complete" | "saved";
export type MetricColor = "red" | "amber" | "neutral" | "green" | "blue";

export interface FetchAdminAnalyticsQuery {
	range?: AnalyticsRange;
	dateFrom?: string;
	dateTo?: string;
	tz?: string;
	difficultBy?: DifficultBy;
	popularBy?: PopularBy;
	difficultLimit?: number;
	popularLimit?: number;
	topUsersLimit?: number;
	topUnknownWordsLimit?: number;
}

export interface AnalyticsFilters {
	range: string;
	dateFrom: string;
	dateTo: string;
	tz: string;
}

export interface AnalyticsInsight {
	title: string;
	message: string;
	severity: "info" | "warning";
}

export interface KpiItem {
	key: string;
	label: string;
	value: number;
	valueFormatted: string;
	changeType: "up" | "down" | "neutral";
	changeValue: number;
	changeUnit: "percent" | "pp";
	changeText: string;
}

export interface LevelDistItem {
	level: CefrLevel;
	levelLabel: string;
	usersCount: number;
	percent: number;
}

export interface HeatmapHour {
	hour: number;
	values: number[];
}

export interface EventsChartSeries {
	openText: number[];
	addToDict: number[];
	failLookup: number[];
}

export interface TopActiveUser {
	userId: string;
	fullName: string;
	initials: string;
	level: CefrLevel | null;
	streakDays: number;
	eventsCount: number;
}

export interface DifficultTextItem {
	rank: number;
	textId: string;
	title: string;
	level: CefrLevel | null;
	wordsCount: number;
	metricValue: number;
	metricLabel: string;
	metricColor: MetricColor;
}

export interface PopularTextItem {
	rank: number;
	textId: string;
	title: string;
	author: string | null;
	level: CefrLevel | null;
	metricValue: number;
	metricLabel: string;
}

export interface TopUnknownWord {
	rank: number;
	word: string;
	count: number;
	percentOfTop: number;
}

export interface ReadingFunnel {
	openedCount: number;
	openedEventsCount: number;
	read25Count: number;
	read50Count: number;
	read75Count: number;
	completedCount: number;
	read25Percent: number;
	read50Percent: number;
	read75Percent: number;
	completedPercent: number;
}

export interface Sm2Stats {
	totalReviews: number;
	totalReviewsChangePercent: number | null;
	avgGrade: number;
	retentionRatePercent: number;
	avgIntervalDays: number;
	avgEaseFactor: number;
}

export interface AdminAnalyticsResponse {
	filters: AnalyticsFilters;
	insight: AnalyticsInsight;
	kpis: { items: KpiItem[] };
	levelDistribution: { totalUsers: number; items: LevelDistItem[] };
	activityHeatmap: {
		days: string[];
		hours: HeatmapHour[];
		maxCount: number;
	};
	eventsChart: {
		labels: string[];
		series: EventsChartSeries;
		totals: { openText: number; addToDict: number; failLookup: number };
	};
	topActiveUsers: TopActiveUser[];
	difficultTexts: { tab: DifficultBy; items: DifficultTextItem[] };
	popularTexts: { tab: PopularBy; items: PopularTextItem[] };
	topUnknownWords: TopUnknownWord[];
	readingFunnel: ReadingFunnel;
	sm2Stats: Sm2Stats;
}

export interface DifficultTextsResponse {
	tab: DifficultBy;
	items: DifficultTextItem[];
}

export interface PopularTextsResponse {
	tab: PopularBy;
	items: PopularTextItem[];
}

export interface AnalyticsExportResponse {
	format: "json" | "csv";
	fileName: string;
	content: string;
}
