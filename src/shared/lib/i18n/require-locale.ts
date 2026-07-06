import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/i18n/locale-list";

export const requireLocale: (lang: string) => asserts lang is Locale = (lang) => {
	if (!hasLocale(lang)) notFound();
};

export const guardLocaleMetadata = (lang: string): lang is Locale => {
	return hasLocale(lang);
};
