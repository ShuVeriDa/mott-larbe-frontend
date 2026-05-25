"use client";

import type { AiPhraseTranslation } from "@/entities/ai-translation";
import { aiTranslationApi } from "@/entities/ai-translation";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { isAxiosError } from "axios";
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
	const { error: toastError } = useToast();
	const { t } = useI18n();

	const getErrorKey = (e: unknown): string => {
		if (
			isAxiosError(e) &&
			e.response?.data?.message === "location_not_supported"
		) {
			return "aiTranslation.phrase.errorLocationNotSupported";
		}
		return "aiTranslation.phrase.error";
	};

	const translate = async (phrase: string, contextSentence?: string) => {
		setState({ phase: "loading" });
		setRefineState({ phase: "idle" });
		try {
			const result = await aiTranslationApi.translatePhrase({
				phrase,
				contextSentence,
			});
			setState({ phase: "done", result });
		} catch (e) {
			const errorMessage = t(getErrorKey(e));
			setState({ phase: "error", errorMessage });
			toastError(errorMessage);
		}
	};

	const openRefine = () => setRefineState({ phase: "open" });
	const closeRefine = () => setRefineState({ phase: "idle" });

	const refine = async (
		phrase: string,
		previousTranslation: string,
		hint: string,
	) => {
		setRefineState({ phase: "loading" });
		try {
			const result = await aiTranslationApi.refinePhrase({
				phrase,
				previousTranslation,
				hint,
			});
			setRefineState({ phase: "done", result });
		} catch (e) {
			setRefineState({ phase: "error" });
			console.log({ e });

			toastError(
				t(
					isAxiosError(e) &&
						e.response?.data?.message === "location_not_supported"
						? "aiTranslation.phrase.errorLocationNotSupported"
						: "aiTranslation.phrase.refineError",
				),
			);
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
