import { notFound } from "next/navigation";
import { hasLocale } from "@/i18n/locale-list";

export const requireLocale = (lang: string) => {
	if (!hasLocale(lang)) notFound();
};

export const guardLocaleMetadata = (lang: string): boolean => {
	return hasLocale(lang);
};
