"use client";

import { usePageBookmarks, useTogglePageBookmark } from "@/entities/page-bookmark";
import { useI18n } from "@/shared/lib/i18n";
import { useToast } from "@/shared/lib/toast";

export const usePageBookmarkToggle = (textId: string, pageNumber: number, snippet: string) => {
  const { t } = useI18n();
  const { success: toastSuccess, error: toastError } = useToast();

  const { data: bookmarks } = usePageBookmarks(textId);
  const { mutate, isPending } = useTogglePageBookmark(textId);

  const isBookmarked = bookmarks?.some((b) => b.pageNumber === pageNumber) ?? false;

  const handleToggle = () => {
    mutate(
      { textId, pageNumber, snippet },
      {
        onSuccess: (result) => {
          if (result.bookmarked) {
            toastSuccess(t("reader.toasts.bookmarkAdded"));
          } else {
            toastSuccess(t("reader.toasts.bookmarkRemoved"));
          }
        },
        onError: () => {
          toastError(t("reader.toasts.bookmarkFailed"));
        },
      },
    );
  };

  return { isBookmarked, isLoading: isPending, handleToggle };
};
