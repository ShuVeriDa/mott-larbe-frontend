import type { TipTapDoc } from "@/shared/ui/notion-editor";
import type { UserTextLanguage } from "@/entities/user-text";

export type GeneratedContentType = "PROSE" | "DIALOGUE" | "STORY";
// Держать в синхроне с GENERATION_DIFFICULTIES в backend generate-user-text.dto.ts.
// Полная шкала CEFR (включая C1/C2) — генерация не попадает в общую библиотеку
// (там тексты размечены упрощённо A/B/C), поэтому здесь допустима точность до подуровня.
export type GenerationDifficulty = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type GenerationTone = "NEUTRAL" | "CONVERSATIONAL" | "FORMAL";

// Держать в синхроне с GENERATION_TOPICS в backend generate-user-text.dto.ts (Step 2) —
// единственный источник истины — бэкенд-константа; при добавлении новой темы обновлять оба места.
export type GenerationTopic =
	| "FAMILY"
	| "FOOD"
	| "TRAVEL"
	| "NATURE"
	| "CITY"
	| "WORK"
	| "HOLIDAYS"
	| "FRIENDSHIP"
	| "CUSTOM";

// Держать в синхроне с GENERATION_GRAMMAR_FOCUS в backend DTO (Step 2).
// Языково-нейтральный список (не привязан к чеченской морфологии) + CUSTOM для свободного ввода
// (нужен для языково-специфичных тем, напр. "эргативный падеж" для чеченского, "артикли" для английского).
export type GenerationGrammarFocus =
	| "PAST_TENSE"
	| "PRESENT_TENSE"
	| "FUTURE_TENSE"
	| "PLURAL_FORMATION"
	| "COMPARATIVES"
	| "QUESTIONS"
	| "NEGATION"
	| "CONDITIONALS"
	| "POSSESSIVES"
	| "CUSTOM"
	| "NONE";

export interface GenerateTextDto {
	language: UserTextLanguage;
	contentType: GeneratedContentType;
	topic: GenerationTopic;
	customTopic?: string; // обязателен, если topic === "CUSTOM" — валидируется на бэкенде, здесь просто string
	tone?: GenerationTone;
	dialogueCharacterCount?: number; // только при contentType === "DIALOGUE"
	grammarFocus?: GenerationGrammarFocus;
	customGrammarFocus?: string; // обязателен, если grammarFocus === "CUSTOM" — валидируется на бэкенде
	dictionaryEntryIds?: string[]; // UserDictionaryEntry.id — NOT lemmaId (see entities/dictionary DictionaryEntry.id)
	customWords?: string[];
	targetLength: number;
	difficulty?: GenerationDifficulty;
}

export interface GeneratedTextResult {
	content: TipTapDoc;
	usedWords: string[];
	description: string | null;
	genreId: string | null;
}
