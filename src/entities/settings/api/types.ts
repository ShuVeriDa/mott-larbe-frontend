export type ThemePreference = "LIGHT" | "DARK" | "SYSTEM";
export type UiLanguage = "RU" | "EN";
export type TranslationLanguage = "RU" | "EN" | "AR";
export type PopupMode = "POPUP" | "SIDEBAR" | "BOTH";

export interface UserPreferences {
	userId: string;
	theme: ThemePreference;
	uiLanguage: UiLanguage;
	fontSize: number;
	popupMode: PopupMode;
	highlightKnown: boolean;
	showProgress: boolean;
	autoNextPage: boolean;
	autoAddOnClick: boolean;
	showGrammar: boolean;
	showExamples: boolean;
	translationLanguage: TranslationLanguage;
	showReviewReminder: boolean;
	enableDecks: boolean;
}

export interface UserGoals {
	userId: string;
	dailyWords: number;
	dailyMinutes: number;
	vocabularyGoal: number;
}

export interface UserNotifications {
	userId: string;
	repeatReminder: boolean;
	weeklyReport: boolean;
	newTexts: boolean;
	supportReplies: boolean;
	marketing: boolean;
	reminderTime: string;
	timezone: string;
}

export interface AllSettings {
	preferences: UserPreferences;
	goals: UserGoals;
	notifications: UserNotifications;
}

export interface UpdatePreferencesDto {
	theme?: ThemePreference;
	uiLanguage?: UiLanguage;
	fontSize?: number;
	popupMode?: PopupMode;
	highlightKnown?: boolean;
	showProgress?: boolean;
	autoNextPage?: boolean;
	autoAddOnClick?: boolean;
	showGrammar?: boolean;
	showExamples?: boolean;
	translationLanguage?: TranslationLanguage;
	showReviewReminder?: boolean;
	enableDecks?: boolean;
}

export interface UpdateGoalsDto {
	dailyWords?: number;
	dailyMinutes?: number;
	vocabularyGoal?: number;
}

export interface UpdateNotificationsDto {
	repeatReminder?: boolean;
	weeklyReport?: boolean;
	newTexts?: boolean;
	supportReplies?: boolean;
	marketing?: boolean;
	reminderTime?: string;
	timezone?: string;
}

export type ExportFormat = "json" | "csv";
