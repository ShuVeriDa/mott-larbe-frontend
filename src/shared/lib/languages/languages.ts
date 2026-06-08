export type AppLanguage = "CHE" | "RU" | "EN" | "AR";

export interface LanguageConfig {
	code: AppLanguage;
	/** Show this language in public-facing filter UI. Hidden languages still exist in the DB. */
	enabled: boolean;
}

export const LANGUAGES: readonly LanguageConfig[] = [
	{ code: "CHE", enabled: true },
	{ code: "RU", enabled: false },
	{ code: "EN", enabled: false },
	{ code: "AR", enabled: false },
];

export const ENABLED_LANGUAGES = LANGUAGES.filter(l => l.enabled);
