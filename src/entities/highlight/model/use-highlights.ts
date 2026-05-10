"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	highlightApi,
	highlightKeys,
	type CreateHighlightDto,
	type UpdateHighlightDto,
} from "../api";

export const useHighlights = (textId: string, pageNumber: number) =>
	useQuery({
		queryKey: highlightKeys.page(textId, pageNumber),
		queryFn: () => highlightApi.getForPage(textId, pageNumber),
	});

export const useCreateHighlight = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateHighlightDto) => highlightApi.create(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: highlightKeys.page(textId, pageNumber) }),
	});
};

export const useUpdateHighlight = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateHighlightDto }) =>
			highlightApi.update(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: highlightKeys.page(textId, pageNumber) }),
	});
};

export const useDeleteHighlight = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => highlightApi.remove(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: highlightKeys.page(textId, pageNumber) }),
	});
};
