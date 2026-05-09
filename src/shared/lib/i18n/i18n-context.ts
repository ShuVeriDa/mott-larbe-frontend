"use client";
import { createContext } from 'react';
import type { Dictionary, Locale } from "@/i18n/locales";

export interface I18nContextValue {
	lang: Locale;
	dict: Dictionary;
}

export const I18nContext = createContext<I18nContextValue | null>(null);
