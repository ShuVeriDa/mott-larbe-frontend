"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { textKeys } from "@/entities/text";
import { highlightKeys } from "@/entities/highlight";
import { noteKeys } from "@/entities/note";
import { readerContextApi, readerContextKeys } from "../api";

export const useReaderContext = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();

	return useQuery({
		queryKey: readerContextKeys.context(textId, pageNumber),
		queryFn: async () => {
			const ctx = await readerContextApi.getContext(textId, pageNumber);

			qc.setQueryData(textKeys.page(textId, pageNumber), ctx.page);
			qc.setQueryData(textKeys.phrases(textId, pageNumber), ctx.phrases);
			qc.setQueryData(highlightKeys.page(textId, pageNumber), ctx.highlights);
			qc.setQueryData(noteKeys.page(textId, pageNumber), ctx.notes);

			return ctx;
		},
		enabled: Boolean(textId) && Number.isFinite(pageNumber) && pageNumber > 0,
		staleTime: 60_000,
	});
};
