"use client";

import type { AiWordTranslation, TranslationLanguage } from "@/entities/ai-translation";
import { aiTranslationApi } from "@/entities/ai-translation";
import { getApiErrorCode } from "@/shared/api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { useState } from "react";
import { useGeminiFallbackStore } from "./gemini-fallback-store";

export type AiWordLookupState =
	| { phase: "idle" }
	| { phase: "loading" }
	| { phase: "done"; result: AiWordTranslation }
	| { phase: "not_chechen" }
	| { phase: "no_key" }
	| { phase: "location_not_supported" }
	| { phase: "error"; message?: string };

export const useAiWordLookup = () => {
	const [state, setState] = useState<AiWordLookupState>({ phase: "idle" });
	const [voted, setVoted] = useState<"up" | "down" | null>(null);
	const { toastApiError } = useApiErrorToast();
	const { toast } = useToast();
	const { t } = useI18n();
	const { recordRateLimitHit, clearBanner } = useGeminiFallbackStore();

	const translate = async (
		word: string,
		contextSentence?: string,
		targetLanguage?: TranslationLanguage,
	) => {
		setState({ phase: "loading" });
		try {
			const result = await aiTranslationApi.translateWord({
				word,
				contextSentence,
				targetLanguage,
			});
			setState({ phase: "done", result });
			if (result.fallbackUsed) {
				if (result.retryAfterSeconds) {
					recordRateLimitHit();
				}
				toast(t("aiTranslation.fallback.switched"), "default");
			} else {
				clearBanner();
			}
		} catch (err: unknown) {
			const code = getApiErrorCode(err);

			if (code === "NOT_CHECHEN") {
				setState({ phase: "not_chechen" });
			} else if (code === "LOCATION_NOT_SUPPORTED") {
				setState({ phase: "location_not_supported" });
			} else if (code === "GEMINI_KEY_NOT_CONFIGURED") {
				setState({ phase: "no_key" });
			} else {
				setState({ phase: "error" });
				toastApiError(err);
			}
		}
	};

	const vote = async (vote: "up" | "down") => {
		if (state.phase !== "done" || voted) return;
		setVoted(vote);
		try {
			await aiTranslationApi.vote(state.result.id, vote);
		} catch {
			setVoted(null);
		}
	};

	const reset = () => {
		setState({ phase: "idle" });
		setVoted(null);
	};

	return { state, voted, translate, vote, reset };
};
