"use client";
import type { TextPageResponse } from "@/entities/text";
import { useToggleBookmark } from "@/features/bookmark-text";
import { usePageBookmarkToggle } from "@/features/page-bookmark-toggle";
import {
	SHEET_LAYOUT_MAX_WIDTH_PX,
	useWordLookupStore,
} from "@/features/word-lookup";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";

export const useReaderTopbar = (
	textId: string,
	currentPage: number,
	data: TextPageResponse,
) => {
	const { t } = useI18n();
	const { mutate: toggleBookmark, isPending: bookmarking } = useToggleBookmark();
	const { success, error } = useToast();

	const snippet = data.page.contentRaw.slice(0, 100);
	const { isBookmarked: isPageBookmarked, handleToggle: togglePageBookmark } =
		usePageBookmarkToggle(textId, currentPage, snippet);

	const panelOpen = useWordLookupStore(s => s.panelOpen);
	const surface = useWordLookupStore(s => s.surface);
	const activeToken = useWordLookupStore(s => s.activeToken);
	const togglePanel = useWordLookupStore(s => s.togglePanel);
	const openInSheet = useWordLookupStore(s => s.openInSheet);
	const openEmptyWordSheet = useWordLookupStore(s => s.openEmptyWordSheet);
	const closeSheet = useWordLookupStore(s => s.closeSheet);

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

	const metaParts = [data.author, data.level, data.language].filter(Boolean);

	return {
		t,
		bookmarking,
		isPageBookmarked,
		togglePageBookmark,
		wordPanelTogglePressed,
		handleToggleWordPanel,
		handleBookmark,
		metaParts,
	};
};
