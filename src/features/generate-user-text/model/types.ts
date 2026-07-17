import type { GeneratedTextResult } from "@/entities/text-generation";
import type { UserTextLanguage } from "@/entities/user-text";

export interface GenerateUserTextFieldErrors {
	customTopic?: string;
	customGrammarFocus?: string;
}

export type GenerationApplyMode = "replace" | "append" | "new-page";

export interface UseGenerateUserTextProps {
	language: UserTextLanguage;
	onGenerated: (
		result: GeneratedTextResult,
		selectedWordsCount: number,
		applyMode: GenerationApplyMode,
	) => void;
	onNeedsGeminiKey: () => void;
	onGeneratingChange?: (isGenerating: boolean) => void;
	/** Показывать предупреждение о замене на кнопке "Заменить" — true, если активная страница не пустая. */
	isActivePageEmpty: boolean;
}
