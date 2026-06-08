export type ThemePreference = "LIGHT" | "DARK" | "SYSTEM";
export type UiLanguage = "RU" | "EN";
export type TranslationLanguage = "RU" | "EN" | "AR" | "DE" | "FR" | "TR";
export type PopupMode = "POPUP" | "SIDEBAR" | "BOTH";
export type MobileDisplayMode = "POPUP" | "SHEET";

export type ReaderFontFamilyPref = "sans" | "golos" | "serif" | "lora" | "merriweather" | "pt-serif" | "source-serif" | "mono";
export type ReaderFontSizePref = number;
export type ReaderColumnWidthPref = "xs" | "sm" | "md" | "lg" | "full";
export type ReaderPagePaddingPref = "compact" | "normal" | "wide";
export type ReaderLineHeightPref = "compact" | "normal" | "relaxed";
export type ReaderLetterSpacingPref = "tight" | "normal" | "wide";
export type ReaderParagraphSpacingPref = "none" | "compact" | "normal" | "relaxed";
export type ReaderThemePref = "default" | "paper" | "sepia" | "warm" | "night" | "green" | "slate" | "custom";

export interface UserPreferences {
	userId: string;
	theme: ThemePreference;
	uiLanguage: UiLanguage;
	fontSize: number;
	popupMode: PopupMode;
	mobileDisplayMode: MobileDisplayMode;
	highlightKnown: boolean;
	showProgress: boolean;
	autoAddOnClick: boolean;
	showGrammar: boolean;
	showExamples: boolean;
	translationLanguage: TranslationLanguage;
	showReviewReminder: boolean;
	enableDecks: boolean;
	enableSm2: boolean;
	enablePhrases: boolean;
	readerFontFamily: ReaderFontFamilyPref;
	readerFontSize: ReaderFontSizePref;
	readerColumnWidth: ReaderColumnWidthPref;
	readerPagePadding: ReaderPagePaddingPref;
	readerLineHeight: ReaderLineHeightPref;
	readerLetterSpacing: ReaderLetterSpacingPref;
	readerParagraphSpacing: ReaderParagraphSpacingPref;
	readerTheme: ReaderThemePref;
	readerBgColor: string;
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
	inAppFeedbackReply: boolean;
	inAppSuggestion: boolean;
	inAppTextSubmission: boolean;
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
	mobileDisplayMode?: MobileDisplayMode;
	highlightKnown?: boolean;
	showProgress?: boolean;
	autoAddOnClick?: boolean;
	showGrammar?: boolean;
	showExamples?: boolean;
	translationLanguage?: TranslationLanguage;
	showReviewReminder?: boolean;
	enableDecks?: boolean;
	enableSm2?: boolean;
	enablePhrases?: boolean;
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
	inAppFeedbackReply?: boolean;
	inAppSuggestion?: boolean;
	inAppTextSubmission?: boolean;
}

export type ExportFormat = "json" | "csv";
