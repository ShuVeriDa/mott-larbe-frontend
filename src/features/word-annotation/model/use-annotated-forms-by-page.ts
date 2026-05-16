"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { annotationApi } from "../api/annotation-api";
import { annotationKeys } from "../api/annotation-keys";

export const useAnnotatedFormsByPage = (textId: string, pageNumber: number) =>
	useQuery({
		queryKey: annotationKeys.annotatedFormsByPage(textId, pageNumber),
		queryFn: () => annotationApi.getAnnotatedFormsByPage(textId, pageNumber),
		enabled: Boolean(textId) && pageNumber >= 1,
		staleTime: 30_000,
	});

export const useDeleteMorphForm = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => annotationApi.deleteMorphForm(id),
		onSuccess: () => {
			void qc.invalidateQueries({
				queryKey: annotationKeys.annotatedFormsByPage(textId, pageNumber),
			});
			void qc.invalidateQueries({ queryKey: annotationKeys.morphForms.all });
		},
	});
};

export const useUpdateMorphForm = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, translation }: { id: string; translation?: string }) =>
			annotationApi.updateMorphForm(id, { translation }),
		onSuccess: () => {
			void qc.invalidateQueries({
				queryKey: annotationKeys.annotatedFormsByPage(textId, pageNumber),
			});
			void qc.invalidateQueries({ queryKey: annotationKeys.morphForms.all });
		},
	});
};
