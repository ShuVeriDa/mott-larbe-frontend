"use client";

import { useAddToVocabulary } from "@/features/add-to-vocabulary";
import { useWordLookupStore } from "@/features/word-lookup";
import { useWordLookup } from "@/entities/word";
import { useUpdateWord } from "@/features/update-word";
import { useToast } from "@/shared/lib/toast";
import { useI18n } from "@/shared/lib/i18n";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export interface ReaderKeyboardHandlers {
	onNavigate: (page: number) => void;
	onToggleNotes?: () => void;
	onToggleToc?: () => void;
	onToggleBookmarks?: () => void;
	onToggleFocusMode?: () => void;
	onToggleAiHistory?: () => void;
}

export const useReaderKeyboard = (
	pageNumber: number,
	totalPages: number,
	handlers: ReaderKeyboardHandlers,
) => {
	const { t } = useI18n();
	const { success } = useToast();

	const { activeToken, togglePanel, closePopup } = useWordLookupStore(
		useShallow(s => ({
			activeToken: s.activeToken,
			togglePanel: s.togglePanel,
			closePopup: s.closePopup,
		})),
	);

	const { data: lookup } = useWordLookup(activeToken?.id ?? null);

	const { mutate: addToVocabulary } = useAddToVocabulary();
	const { mutate: updateWord } = useUpdateWord();

	const {
		onNavigate,
		onToggleNotes,
		onToggleToc,
		onToggleBookmarks,
		onToggleFocusMode,
		onToggleAiHistory,
	} = handlers;

	useEffect(() => {
		const handleKey = (e: KeyboardEvent) => {
			const tag = document.activeElement?.tagName;
			if (tag === "INPUT" || tag === "TEXTAREA") return;

			switch (e.key) {
				case "ArrowRight": {
					if (pageNumber < totalPages) {
						e.preventDefault();
						onNavigate(pageNumber + 1);
					}
					break;
				}
				case "ArrowLeft": {
					if (pageNumber > 1) {
						e.preventDefault();
						onNavigate(pageNumber - 1);
					}
					break;
				}
				case " ": {
					e.preventDefault();
					togglePanel();
					break;
				}
				case "Escape": {
					closePopup();
					break;
				}
				case "n":
				case "N": {
					e.preventDefault();
					onToggleNotes?.();
					break;
				}
				case "t":
				case "T": {
					e.preventDefault();
					onToggleToc?.();
					break;
				}
				case "b":
				case "B": {
					e.preventDefault();
					onToggleBookmarks?.();
					break;
				}
				case "f":
				case "F": {
					e.preventDefault();
					onToggleFocusMode?.();
					break;
				}
				case "h":
				case "H": {
					e.preventDefault();
					onToggleAiHistory?.();
					break;
				}
				case "a":
				case "A": {
					if (!activeToken) break;
					if (lookup?.inDictionary) break;
					e.preventDefault();
					addToVocabulary(
						{
							tokenId: activeToken.id,
							word: activeToken.original,
							translation: lookup?.translation ?? undefined,
						},
						{ onSuccess: () => success(t("reader.toasts.addedToDict")) },
					);
					break;
				}
				case "k":
				case "K": {
					if (!activeToken) break;
					e.preventDefault();
					if (lookup?.inDictionary && lookup.dictionaryEntryId) {
						updateWord({
							id: lookup.dictionaryEntryId,
							body: { learningLevel: "KNOWN" },
							previousLevel: lookup.userStatus ?? undefined,
						});
					} else {
						addToVocabulary(
							{
								tokenId: activeToken.id,
								word: activeToken.original,
								translation: lookup?.translation ?? undefined,
							},
							{ onSuccess: () => success(t("reader.toasts.addedToDict")) },
						);
					}
					break;
				}
			}
		};

		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [
		pageNumber,
		totalPages,
		onNavigate,
		onToggleNotes,
		onToggleToc,
		onToggleBookmarks,
		onToggleFocusMode,
		onToggleAiHistory,
		togglePanel,
		closePopup,
		activeToken,
		lookup,
		addToVocabulary,
		updateWord,
		success,
		t,
	]);
};
