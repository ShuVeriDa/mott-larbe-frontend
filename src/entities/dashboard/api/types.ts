export interface DashboardStreakDay {
	date: string;
	label: string;
	active: boolean;
	isToday: boolean;
}

export interface DashboardDueToday {
	total: number;
	new: number;
	learning: number;
}

export interface DashboardWords {
	total: number;
	new: number;
	learning: number;
	known: number;
}

export interface DashboardStats {
	textsRead: number;
	wordsInDictionary: number;
	streak: number;
	streakRecord: number;
	streakDays: DashboardStreakDay[];
	dueToday: DashboardDueToday;
	words: DashboardWords;
}

export interface DashboardContinueItem {
	id: string;
	title: string;
	author: string | null;
	level: string | null;
	language: string;
	imageUrl: string | null;
	progressPercent: number;
	lastOpened: string;
	lastPageNumber: number;
	totalPages: number;
	tags: Array<{ id: string; name: string }>;
}

export interface DashboardPlan {
	code: string;
	name: string;
	type: string;
	status: string;
	isPremium: boolean;
	translationsToday: number;
	translationsLimit: number | null;
}

export interface DashboardResponse {
	stats: DashboardStats;
	continueReading: DashboardContinueItem[];
	plan: DashboardPlan;
}
