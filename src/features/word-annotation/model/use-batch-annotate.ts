"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { annotationApi } from "../api/annotation-api";
import type { BatchAnnotateDto } from "../api/types";

export const useBatchAnnotate = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: BatchAnnotateDto) => annotationApi.batchAnnotate(dto),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ["annotation", "annotated-forms"] });
		},
	});
};
