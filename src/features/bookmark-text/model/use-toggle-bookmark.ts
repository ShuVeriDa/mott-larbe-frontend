"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { textApi, textKeys } from "@/entities/text";

export const useToggleBookmark = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (textId: string) => textApi.toggleBookmark(textId),
		onSuccess: (_, textId) => {
			qc.invalidateQueries({ queryKey: textKeys.bookmark(textId) });
			qc.invalidateQueries({ queryKey: textKeys.root });
		},
	});
};
