export const LOCALES = ["che", "ru", "en"] as const;
export const DEFAULT_LOCALE = "ru" as const;

export type Locale = (typeof LOCALES)[number];

export const hasLocale = (locale: string): locale is Locale =>
	LOCALES.includes(locale as Locale);
