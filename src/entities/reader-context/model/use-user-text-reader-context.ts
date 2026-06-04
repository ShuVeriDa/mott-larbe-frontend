"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { textKeys } from "@/entities/text";
import { highlightKeys } from "@/entities/highlight";
import { noteKeys } from "@/entities/note";
import { userTextReaderContextApi } from "../api/user-text-reader-context-api";
import { readerContextKeys } from "../api/reader-context-keys";

/**
 * Fetches reader context for a UserText page.
 * Seeds data under the SAME readerContextKeys as useReaderContext —
 * so ReaderPage widget (which calls useReaderContext internally) finds
 * the data in cache without any modification to ReaderPage.
 */
export const useUserTextReaderContext = (userTextId: string, pageNumber: number) => {
	const qc = useQueryClient();

	return useQuery({
		// Use the same cache key namespace as useReaderContext
		queryKey: readerContextKeys.context(userTextId, pageNumber),
		queryFn: async () => {
			const ctx = await userTextReaderContextApi.getContext(userTextId, pageNumber);

			// Seed derived cache entries — same as useReaderContext does
			qc.setQueryData(textKeys.page(userTextId, pageNumber), ctx.page);
			qc.setQueryData(textKeys.phrases(userTextId, pageNumber), ctx.phrases);
			qc.setQueryData(highlightKeys.page(userTextId, pageNumber), ctx.highlights);
			qc.setQueryData(noteKeys.page(userTextId, pageNumber), ctx.notes);

			return ctx;
		},
		enabled: Boolean(userTextId) && Number.isFinite(pageNumber) && pageNumber > 0,
		staleTime: 60_000,
	});
};
