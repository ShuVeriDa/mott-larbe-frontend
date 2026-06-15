"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { annotationApi } from "../api/annotation-api";
import { annotationKeys } from "../api/annotation-keys";
import type { UnannotateTokensDto } from "../api/types";

export const useUnannotateTokens = (textId?: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: UnannotateTokensDto) => annotationApi.unannotateTokens(dto),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: annotationKeys.annotatedForms(textId) });
			void qc.invalidateQueries({ queryKey: annotationKeys.occurrences(textId) });
		},
	});
};
