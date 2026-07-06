import "server-only";
import { cacheLife } from "next/cache";
import type { Locale } from "./locale-list";

const dictionaries = {
	che: () => import("../locales/che.json").then((m) => m.default),
	ru: () => import("../locales/ru.json").then((m) => m.default),
	en: () => import("../locales/en.json").then((m) => m.default),
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["ru"]>>;

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
	"use cache";
	cacheLife("max");
	return dictionaries[locale]() as Promise<Dictionary>;
};

export { DEFAULT_LOCALE, LOCALES, hasLocale } from "./locale-list";
export type { Locale } from "./locale-list";
