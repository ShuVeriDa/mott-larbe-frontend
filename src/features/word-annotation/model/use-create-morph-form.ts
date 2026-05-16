"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { annotationApi } from "../api/annotation-api";
import type { CreateMorphFormDto } from "../api/types";

export const useCreateMorphForm = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateMorphFormDto) => annotationApi.createMorphForm(dto),
		onSuccess: () => {
			void qc.invalidateQueries({ queryKey: ["annotation", "annotated-forms"] });
		},
	});
};
