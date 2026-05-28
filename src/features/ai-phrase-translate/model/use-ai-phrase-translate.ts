"use client";

import type { AiPhraseTranslation, TranslationLanguage } from "@/entities/ai-translation";
import { aiTranslationApi } from "@/entities/ai-translation";
import { getApiErrorCode } from "@/shared/api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useState } from "react";

export type AiPhraseTranslateState =
	| { phase: "idle" }
	| { phase: "loading" }
	| { phase: "done"; result: AiPhraseTranslation }
	| { phase: "error"; errorMessage: string };

export type AiPhraseRefineState =
	| { phase: "idle" }
	| { phase: "open" }
	| { phase: "loading" }
	| { phase: "done"; result: AiPhraseTranslation }
	| { phase: "error" };

export const useAiPhraseTranslate = () => {
	const [state, setState] = useState<AiPhraseTranslateState>({ phase: "idle" });
	const [refineState, setRefineState] = useState<AiPhraseRefineState>({
		phase: "idle",
	});
	const { toastApiError } = useApiErrorToast();
	const { toast } = useToast();
	const { t } = useI18n();

	const translate = async (
		phrase: string,
		contextSentence?: string,
		targetLanguage?: TranslationLanguage,
	) => {
		setState({ phase: "loading" });
		setRefineState({ phase: "idle" });
		try {
			const result = await aiTranslationApi.translatePhrase({
				phrase,
				contextSentence,
				targetLanguage,
			});
			setState({ phase: "done", result });
			if (result.fallbackUsed) {
				toast(t("aiTranslation.fallback.switched"), "default");
			}
		} catch (e) {
			const code = getApiErrorCode(e);
			const i18nKey =
				code === "LOCATION_NOT_SUPPORTED"
					? "aiTranslation.phrase.errorLocationNotSupported"
					: "aiTranslation.phrase.error";
			const errorMessage = t(i18nKey);
			setState({ phase: "error", errorMessage });
			toastApiError(e);
		}
	};

	const openRefine = () => setRefineState({ phase: "open" });
	const closeRefine = () => setRefineState({ phase: "idle" });

	const refine = async (
		phrase: string,
		previousTranslation: string,
		hint: string,
		targetLanguage?: TranslationLanguage,
	) => {
		setRefineState({ phase: "loading" });
		try {
			const result = await aiTranslationApi.refinePhrase({
				phrase,
				previousTranslation,
				hint,
				targetLanguage,
			});
			setRefineState({ phase: "done", result });
			if (result.fallbackUsed) {
				toast(t("aiTranslation.fallback.switched"), "default");
			}
		} catch (e) {
			setRefineState({ phase: "error" });
			toastApiError(e);
		}
	};

	const reset = () => {
		setState({ phase: "idle" });
		setRefineState({ phase: "idle" });
	};

	return {
		state,
		refineState,
		translate,
		openRefine,
		closeRefine,
		refine,
		reset,
	};
};
