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

export interface HeatmapHourCell {
	hour: number;
	count: number;
	level: HeatmapLevel;
}

export interface HeatmapWeekDay {
	date: string;
	label: string;
	hours: HeatmapHourCell[];
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

export interface ActivityItemMetaReadText {
	textTitle: string | null;
	pageNumber: number | null;
}

export interface ActivityItemMetaAddWords {
	count: number;
}

export interface ActivityItemMetaReview {
	total: number;
	accuracy: number;
}

export type ActivityItemMeta =
	| ActivityItemMetaReadText
	| ActivityItemMetaAddWords
	| ActivityItemMetaReview;

export interface ActivityItem {
	type: ActivityType;
	date: string;
	icon: string;
	meta: ActivityItemMeta;
}

export interface PhrasesBreakdown {
	total: number;
	new: number;
	learning: number;
	known: number;
}

export interface PhraseAccuracyStats {
	percent: number;
	correct: number;
	wrong: number;
	bestStreak: number;
	total: number;
}

export interface UserEventsChartSeries {
	openText: number[];
	addToDict: number[];
	reviewSession: number[];
}

export interface VocabularyGrowthPoint {
	date: string;
	total: number;
	added: number;
}

export interface UserEventsChart {
	labels: string[];
	series: UserEventsChartSeries;
}

// ─── Achievements ─────────────────────────────────────────────────────────────

export interface Achievement {
	id: string;
	icon: string;
	reached: boolean;
}

export interface AchievementsData {
	list: Achievement[];
	reached: number;
	total: number;
}

// ─── Goal forecast ────────────────────────────────────────────────────────────

export interface GoalForecast {
	goal: number;
	current: number;
	remaining: number;
	avgPerDay: number;
	daysToGoal: number | null;
	pct: number;
}

// ─── Review sessions ──────────────────────────────────────────────────────────

export interface ReviewSessionsStats {
	totalSessions: number;
	totalCards: number;
	avgCardsPerSession: number;
	bestDayCount: number;
	avgDurationSeconds: number | null;
	masteredWords: number;
}

// ─── Retention ────────────────────────────────────────────────────────────────

export interface RetentionLevel {
	level: string;
	count: number;
}

export interface RetentionData {
	levels: RetentionLevel[];
	dueForReview: number;
	total: number;
}

// ─── Top words ────────────────────────────────────────────────────────────────

export interface HardWord {
	word: string;
	translation: string;
	level: string;
	wrongCount: number;
}

export interface MasteredWord {
	word: string;
	translation: string;
	addedAt: string;
}

export interface TopWordsData {
	hardest: HardWord[];
	recentlyMastered: MasteredWord[];
}

// ─── Weekday activity ─────────────────────────────────────────────────────────

export interface WeekdayPoint {
	label: string;
	total: number;
	avg: number;
}

// ─── Reading speed ────────────────────────────────────────────────────────────

export interface ReadingSpeedPoint {
	date: string;
	wpm: number;
}

export interface ReadingSpeedData {
	avg: number;
	best: number;
	points: ReadingSpeedPoint[];
}

// ─── Weak spots ───────────────────────────────────────────────────────────────

export interface AbandonedText {
	id: string;
	title: string;
	level: string | null;
	imageUrl: string | null;
	progressPercent: number;
	lastOpened: string | null;
}

export interface StrugglingWord {
	word: string;
	translation: string;
	updatedAt: string;
	learningLevel: string;
}

export interface LowAccuracyWord {
	word: string;
	translation: string;
	wrongCount: number;
}

export interface WeakSpotsData {
	abandonedTexts: AbandonedText[];
	strugglingWords: StrugglingWord[];
	lowAccuracy: LowAccuracyWord[];
}

// ─── KPI Sparklines ───────────────────────────────────────────────────────────

export interface KpiSparklines {
	wordsLearned: number[];
	reviews: number[];
	readingTime: number[];
	textsRead: number[];
}

// ─── Main response ────────────────────────────────────────────────────────────

export interface StatisticsResponse {
	period: StatsPeriod;
	header: StatsHeader;
	streak: StreakInfo;
	heatmap: HeatmapMonth[];
	heatmapWeek: HeatmapWeekDay[];
	words: WordsBreakdown;
	wordsPerDay: WordsPerDayPoint[];
	texts: TextProgressItem[];
	accuracy: AccuracyStats;
	recentActivity: ActivityItem[];
	phraseProgress: PhrasesBreakdown;
	phrasesPerDay: WordsPerDayPoint[];
	phraseAccuracy: PhraseAccuracyStats;
	eventsChart: UserEventsChart;
	vocabularyGrowth: VocabularyGrowthPoint[];
	achievements: AchievementsData;
	goalForecast: GoalForecast;
	reviewSessions: ReviewSessionsStats;
	retention: RetentionData;
	topWords: TopWordsData;
	weekdayActivity: WeekdayPoint[];
	readingSpeed: ReadingSpeedData;
	weakSpots: WeakSpotsData;
	kpiSparklines: KpiSparklines;
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
