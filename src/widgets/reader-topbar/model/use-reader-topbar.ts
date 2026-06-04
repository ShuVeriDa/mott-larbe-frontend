"use client";
import type { TextPageResponse } from "@/entities/text";
import { textApi } from "@/entities/text";
import { useToggleBookmark } from "@/features/bookmark-text";
import { usePageBookmarkToggle } from "@/features/page-bookmark-toggle";
import {
	SHEET_LAYOUT_MAX_WIDTH_PX,
	useWordLookupStore,
} from "@/features/word-lookup";
import { useI18n } from "@/shared/lib/i18n";
import { LANG_TAG } from "@/shared/lib/lang-tag";
import { useToast } from "@/shared/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const useReaderTopbar = (
	textId: string,
	currentPage: number,
	data: TextPageResponse,
) => {
	const { t } = useI18n();
	const { mutate: toggleBookmark, isPending: bookmarking } = useToggleBookmark();
	const { success, error } = useToast();
	const [isCompleted, setIsCompleted] = useState(data.progress >= 100);

	const { mutate: markComplete, isPending: completing } = useMutation({
		mutationFn: () => textApi.markComplete(textId),
		onSuccess: () => {
			setIsCompleted(true);
			success(t("reader.toasts.markedComplete"));
		},
		onError: () => error(t("reader.toasts.markCompleteFailed")),
	});

	const handleMarkComplete = () => markComplete();

	const snippet = data.page.contentRaw.slice(0, 100);
	const { isBookmarked: isPageBookmarked, handleToggle: togglePageBookmark } =
		usePageBookmarkToggle(textId, currentPage, snippet);

	const {
		panelOpen,
		surface,
		activeToken,
		togglePanel,
		openInSheet,
		openEmptyWordSheet,
		closeSheet,
	} = useWordLookupStore(
		useShallow(s => ({
			panelOpen: s.panelOpen,
			surface: s.surface,
			activeToken: s.activeToken,
			togglePanel: s.togglePanel,
			openInSheet: s.openInSheet,
			openEmptyWordSheet: s.openEmptyWordSheet,
			closeSheet: s.closeSheet,
		})),
	);

	const handleToggleWordPanel = () => {
		if (
			typeof window !== "undefined" &&
			window.innerWidth <= SHEET_LAYOUT_MAX_WIDTH_PX
		) {
			if (surface === "sheet") {
				closeSheet();
				return;
			}
			if (activeToken) {
				openInSheet(activeToken);
				return;
			}
			openEmptyWordSheet();
			return;
		}
		togglePanel();
	};

	const wordPanelTogglePressed = panelOpen || surface === "sheet";

	const handleBookmark = () => {
		toggleBookmark(textId, {
			onSuccess: ({ bookmarked }) =>
				success(
					bookmarked
						? t("reader.toasts.bookmarkAdded")
						: t("reader.toasts.bookmarkRemoved"),
				),
			onError: () => error(t("reader.toasts.bookmarkFailed")),
		});
	};

	const level = data.level ? t(`shared.cefrLevel.${data.level}`) : "";

	const metaParts = [data.author, level, LANG_TAG[data.language]].filter(
		Boolean,
	);

	const submittedByName = data.submittedBy
		? [data.submittedBy.name, data.submittedBy.surname].filter(Boolean).join(" ") || data.submittedBy.username
		: null;

	return {
		t,
		bookmarking,
		isPageBookmarked,
		togglePageBookmark,
		wordPanelTogglePressed,
		handleToggleWordPanel,
		handleBookmark,
		metaParts,
		submittedByName,
		isCompleted,
		completing,
		handleMarkComplete,
	};
};
