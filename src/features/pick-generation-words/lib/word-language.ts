import type { DictionaryEntry, DictionaryLemmaLanguage } from "@/entities/dictionary";

export const wordLanguage = (entry: DictionaryEntry): DictionaryLemmaLanguage | null =>
	entry.lemma?.language ?? null;

export const LANGUAGE_BADGE_CODE: Record<DictionaryLemmaLanguage, string> = {
	CHE: "CHE",
	RU: "RU",
	AR: "AR",
	EN: "EN",
};
