"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { annotationApi } from "../api/annotation-api";
import type { UnannotateTokensDto } from "../api/types";

export const useUnannotateTokens = (textId?: string) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: UnannotateTokensDto) => annotationApi.unannotateTokens(dto),
		onSuccess: () => {
			if (textId) {
				void qc.invalidateQueries({ queryKey: ["annotation", "annotated-forms", textId] });
				void qc.invalidateQueries({ queryKey: ["annotation", "occurrences", textId] });
			} else {
				void qc.invalidateQueries({ queryKey: ["annotation", "annotated-forms"] });
				void qc.invalidateQueries({ queryKey: ["annotation", "occurrences"] });
			}
		},
	});
};
