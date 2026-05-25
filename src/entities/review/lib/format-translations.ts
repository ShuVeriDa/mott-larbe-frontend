import type { ReviewLemma } from "../api";

export const getPrimaryTranslation = (lemma: ReviewLemma): string => {
	// Prefer the headword entry translation, fall back to the user's own saved translation
	const fromHeadword = lemma.headwords[0]?.entry.rawTranslate?.trim();
	if (fromHeadword) return fromHeadword;
	const fromDictionary = lemma.userDictionaryEntries?.[0]?.translation?.trim();
	return fromDictionary ?? "";
};

export const getAlternateTranslations = (lemma: ReviewLemma): string[] =>
	lemma.headwords
		.slice(1)
		.map((h) => h.entry.rawTranslate)
		.filter((s): s is string => Boolean(s));
