export type StatsPeriod = "week" | "month" | "year" | "all";

export interface StatsDelta {
	total: number;
	delta: number | null;
}

export interface StatsHeader {
	wordsLearned: StatsDelta;
	readingTimeMinutes: StatsDelta;
	reviews: StatsDelta;
	textsRead: StatsDelta;
}

export interface StreakMilestone {
	days: number;
	reached: boolean;
}

export interface StreakInfo {
	current: number;
	record: number;
	weekDays: number[];
	milestones: StreakMilestone[];
}

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export interface HeatmapDay {
	date: string;
	level: HeatmapLevel;
	count: number;
}

export interface HeatmapMonth {
	month: string;
	days: HeatmapDay[];
}

export interface WordsBreakdown {
	total: number;
	new: number;
	learning: number;
	known: number;
	goal: number;
}

export interface WordsPerDayPoint {
	date: string;
	count: number;
}

export interface TextProgressItem {
	id: string;
	title: string;
	imageUrl: string | null;
	level: string;
	language: string;
	wordCount: number;
	progressPercent: number;
	knownWords: number;
	lastOpened: string | null;
}

export interface AccuracyStats {
	percent: number;
	correct: number;
	wrong: number;
	bestStreak: number;
	sessions: number;
}

export type ActivityType = "READ_TEXT" | "ADD_WORDS" | "REVIEW";

export interface ActivityItem {
	type: ActivityType;
	title: string;
	description: string;
	date: string;
	icon: string;
}

export interface StatisticsResponse {
	period: StatsPeriod;
	header: StatsHeader;
	streak: StreakInfo;
	heatmap: HeatmapMonth[];
	words: WordsBreakdown;
	wordsPerDay: WordsPerDayPoint[];
	texts: TextProgressItem[];
	accuracy: AccuracyStats;
	recentActivity: ActivityItem[];
}

export interface StatisticsQuery {
	period?: StatsPeriod;
	activityLimit?: number;
}

export interface ProfileSummary {
	words: WordsBreakdown;
	textsRead: number;
	streak: { current: number; record: number };
	heatmap: HeatmapDay[];
}
