import type { TranslationLanguage } from "@/entities/ai-translation";
import type { Phrase } from "../api/types";

export const getPhraseTranslation = (
	phrase: Phrase,
	targetLanguage: TranslationLanguage,
): string => {
	switch (targetLanguage) {
		case "en": return phrase.translationEn ?? phrase.translation;
		case "ar": return phrase.translationAr ?? phrase.translation;
		case "de": return phrase.translationDe ?? phrase.translation;
		case "fr": return phrase.translationFr ?? phrase.translation;
		case "tr": return phrase.translationTr ?? phrase.translation;
		default:   return phrase.translation;
	}
};
