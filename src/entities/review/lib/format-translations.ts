import type { ReviewLemma } from "../api";

export const getPrimaryTranslation = (lemma: ReviewLemma): string => {
	const first = lemma.headwords[0]?.entry.rawTranslate;
	return first ?? "";
};

export const getAlternateTranslations = (lemma: ReviewLemma): string[] =>
	lemma.headwords
		.slice(1)
		.map((h) => h.entry.rawTranslate)
		.filter((s): s is string => Boolean(s));
