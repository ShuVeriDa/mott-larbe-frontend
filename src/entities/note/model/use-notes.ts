"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { noteApi, noteKeys, type CreateNoteDto, type UpdateNoteDto } from "../api";

export const useNotes = (textId: string, pageNumber: number) =>
	useQuery({
		queryKey: noteKeys.page(textId, pageNumber),
		queryFn: () => noteApi.getForPage(textId, pageNumber),
	});

export const useCreateNote = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (dto: CreateNoteDto) => noteApi.create(dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.page(textId, pageNumber) }),
	});
};

export const useUpdateNote = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateNoteDto }) =>
			noteApi.update(id, dto),
		onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.page(textId, pageNumber) }),
	});
};

export const useDeleteNote = (textId: string, pageNumber: number) => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => noteApi.remove(id),
		onSuccess: () => qc.invalidateQueries({ queryKey: noteKeys.page(textId, pageNumber) }),
	});
};
