"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
	libraryTextApi,
	libraryTextKeys,
	useLibraryTextDetail,
	useLibraryTextRelated,
	type LibraryTextDetail,
} from "@/entities/library-text";
import { useI18n } from "@/shared/lib/i18n";

export const useLibraryTextDetailPage = (id: string) => {
	const { t, lang } = useI18n();
	const queryClient = useQueryClient();

	const detail = useLibraryTextDetail(id);
	const related = useLibraryTextRelated(id);

	const [copied, setCopied] = useState(false);
	const [reportOpen, setReportOpen] = useState(false);

	const bookmarkMutation = useMutation({
		mutationFn: () => libraryTextApi.toggleBookmark(id),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: libraryTextKeys.detail(id) });
			const previous = queryClient.getQueryData<LibraryTextDetail>(
				libraryTextKeys.detail(id),
			);
			queryClient.setQueryData<LibraryTextDetail>(
				libraryTextKeys.detail(id),
				(old) => (old ? { ...old, isFavorite: !old.isFavorite } : old),
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(libraryTextKeys.detail(id), context.previous);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: libraryTextKeys.detail(id) });
		},
	});

	const handleShare = () => {
		const url = window.location.href;
		if (typeof navigator.share === "function") {
			navigator.share({ url }).catch(() => undefined);
			return;
		}

		navigator.clipboard
			.writeText(url)
			.then(() => {
				setCopied(true);
				setTimeout(() => setCopied(false), 1800);
			})
			.catch(() => undefined);
	};

	const handleRetry = () => detail.refetch();
	const handleToggleBookmark = () => bookmarkMutation.mutate();
	const handleOpenReport = () => setReportOpen(true);

	return {
		t,
		lang,
		detail,
		related,
		copied,
		reportOpen,
		setReportOpen,
		bookmarkMutation,
		handleShare,
		handleRetry,
		handleToggleBookmark,
		handleOpenReport,
	};
};
