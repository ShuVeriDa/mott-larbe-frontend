"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wordKeys } from "@/entities/word";
import { annotationApi } from "../api";
import type { AnnotateTokenDto } from "../api";

export const useAnnotateToken = (tokenId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (dto: AnnotateTokenDto) =>
			annotationApi.annotateToken(tokenId, dto),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: wordKeys.lookup(tokenId) });
		},
	});
};
