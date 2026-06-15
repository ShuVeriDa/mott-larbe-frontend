"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { annotationApi } from "../api/annotation-api";
import { annotationKeys } from "../api/annotation-keys";
import type { BatchAnnotateDto } from "../api/types";

export const useBatchAnnotate = (textId?: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: BatchAnnotateDto) => annotationApi.batchAnnotate(dto),
		onSuccess: (_data, dto) => {
			void qc.invalidateQueries({ queryKey: annotationKeys.annotatedForms(textId) });
			if (textId) {
				void qc.invalidateQueries({
					queryKey: annotationKeys.tokenOccurrences(dto.normalized, textId),
				});
			}
		},
	});
};
