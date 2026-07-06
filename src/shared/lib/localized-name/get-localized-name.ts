import type { LocalizedName } from "@/shared/types";

const isLocalizedNameKey = (key: string): key is keyof LocalizedName =>
	key === "che" || key === "ru" || key === "en";

export const getLocalizedName = (name: LocalizedName, lang: string) =>
	(isLocalizedNameKey(lang) ? name[lang] : undefined) ?? name.ru;
