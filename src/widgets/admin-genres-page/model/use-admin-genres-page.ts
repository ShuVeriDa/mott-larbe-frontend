"use client";

import { genreApi, genreKeys, useAdminGenres, type AdminGenre } from "@/entities/genre";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useAdminGenresPage = () => {
	const queryClient = useQueryClient();
	const genresQuery = useAdminGenres();

	const [modalOpen, setModalOpen] = useState(false);
	const [editGenre, setEditGenre] = useState<AdminGenre | null>(null);

	const invalidate = () => queryClient.invalidateQueries({ queryKey: genreKeys.root });

	const createMutation = useMutation({
		mutationFn: genreApi.create,
		onSuccess: () => { invalidate(); setModalOpen(false); },
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, ...dto }: { id: string; name?: string; slug?: string; sortOrder?: number }) =>
			genreApi.update(id, dto),
		onSuccess: () => { invalidate(); setModalOpen(false); setEditGenre(null); },
	});

	const deleteMutation = useMutation({
		mutationFn: genreApi.delete,
		onSuccess: invalidate,
	});

	const handleOpenCreate = () => { setEditGenre(null); setModalOpen(true); };
	const handleOpenEdit = (genre: AdminGenre) => { setEditGenre(genre); setModalOpen(true); };
	const handleCloseModal = () => { setModalOpen(false); setEditGenre(null); };
	const handleDelete = (id: string) => deleteMutation.mutate(id);

	const handleSubmit = (data: { name: string; slug: string; sortOrder: number }) => {
		if (editGenre) {
			updateMutation.mutate({ id: editGenre.id, ...data });
		} else {
			createMutation.mutate(data);
		}
	};

	return {
		genresQuery,
		genres: genresQuery.data ?? [],
		modalOpen,
		editGenre,
		isSubmitting: createMutation.isPending || updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
		handleOpenCreate,
		handleOpenEdit,
		handleCloseModal,
		handleDelete,
		handleSubmit,
	};
};
