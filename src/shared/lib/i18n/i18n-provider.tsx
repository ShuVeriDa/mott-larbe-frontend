"use client";

import type { Dictionary, Locale } from "@/i18n/locales";
import { I18nContext } from "./i18n-context";

interface I18nProviderProps {
	lang: Locale;
	dict: Dictionary;
	children: React.ReactNode;
}

export const I18nProvider = ({ lang, dict, children }: I18nProviderProps) => (
	<I18nContext.Provider value={{ lang, dict }}>{children}</I18nContext.Provider>
);
