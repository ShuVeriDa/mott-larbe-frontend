import type { GenerationGrammarFocus } from "@/entities/text-generation";

// Значения (value) должны точно совпадать с GENERATION_GRAMMAR_FOCUS в backend
// generate-user-text.dto.ts — ручная синхронизация, нет общего пакета FE/BE.
export const GRAMMAR_FOCUS_OPTIONS: { value: GenerationGrammarFocus; labelKey: string }[] = [
	{ value: "NONE", labelKey: "myTexts.generate.grammarFocus.none" },
	{ value: "PAST_TENSE", labelKey: "myTexts.generate.grammarFocus.pastTense" },
	{ value: "PRESENT_TENSE", labelKey: "myTexts.generate.grammarFocus.presentTense" },
	{ value: "FUTURE_TENSE", labelKey: "myTexts.generate.grammarFocus.futureTense" },
	{ value: "PLURAL_FORMATION", labelKey: "myTexts.generate.grammarFocus.pluralFormation" },
	{ value: "COMPARATIVES", labelKey: "myTexts.generate.grammarFocus.comparatives" },
	{ value: "QUESTIONS", labelKey: "myTexts.generate.grammarFocus.questions" },
	{ value: "NEGATION", labelKey: "myTexts.generate.grammarFocus.negation" },
	{ value: "CONDITIONALS", labelKey: "myTexts.generate.grammarFocus.conditionals" },
	{ value: "POSSESSIVES", labelKey: "myTexts.generate.grammarFocus.possessives" },
	{ value: "CUSTOM", labelKey: "myTexts.generate.grammarFocus.custom" },
];
