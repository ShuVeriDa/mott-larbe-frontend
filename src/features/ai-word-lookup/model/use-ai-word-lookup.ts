"use client";

import type { AiWordTranslation } from "@/entities/ai-translation";
import { aiTranslationApi } from "@/entities/ai-translation";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";
import { isAxiosError } from "axios";
import { useState } from "react";

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
	const { error: toastError } = useToast();
	const { t } = useI18n();

	const translate = async (word: string, contextSentence?: string) => {
		setState({ phase: "loading" });
		try {
			const result = await aiTranslationApi.translateWord({
				word,
				contextSentence,
			});
			setState({ phase: "done", result });
		} catch (err: unknown) {
			console.log({ err });

			if (isAxiosError(err)) {
				const message = err.response?.data?.message as string | undefined;
				if (message === "not_chechen") {
					setState({ phase: "not_chechen" });
				} else if (message === "location_not_supported") {
					setState({ phase: "location_not_supported" });
				} else if (err.response?.status === 400) {
					setState({ phase: "no_key" });
				} else {
					setState({ phase: "error", message });
					toastError(t("aiTranslation.popup.error"));
				}
			} else {
				const msg = err instanceof Error ? err.message : String(err);
				setState({ phase: "error", message: msg });
				toastError(t("aiTranslation.popup.error"));
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
