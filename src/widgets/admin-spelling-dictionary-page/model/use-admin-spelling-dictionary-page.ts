"use client";

import { useState } from "react";
import { useDebounce } from "@/shared/lib/debounce";
import {
	useAdminSpellingDictionary,
	useCreateSpellingEntry,
	useUpdateSpellingEntry,
	useDeleteSpellingEntry,
} from "@/entities/spelling-dictionary";
import type { AdminSpellingEntry, CreateSpellingEntryPayload } from "@/entities/spelling-dictionary";

export const useAdminSpellingDictionaryPage = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(50);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 300);

	const [modalOpen, setModalOpen] = useState(false);
	const [editEntry, setEditEntry] = useState<AdminSpellingEntry | null>(null);
	const [deleteEntry, setDeleteEntry] = useState<AdminSpellingEntry | null>(null);

	const query = useAdminSpellingDictionary({
		page,
		limit,
		search: debouncedSearch || undefined,
	});

	const createMutation = useCreateSpellingEntry();
	const updateMutation = useUpdateSpellingEntry();
	const deleteMutation = useDeleteSpellingEntry();

	const total = query.data?.total ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / limit));

	const handleLimitChange = (newLimit: number) => {
		setLimit(newLimit);
		setPage(1);
	};

	const handleSearchChange = (value: string) => {
		setSearch(value);
		setPage(1);
	};

	const openCreate = () => {
		setEditEntry(null);
		setModalOpen(true);
	};

	const openEdit = (entry: AdminSpellingEntry) => {
		setEditEntry(entry);
		setModalOpen(true);
	};

	const handleModalSubmit = async (payload: CreateSpellingEntryPayload) => {
		if (editEntry) {
			await updateMutation.mutateAsync({ id: editEntry.id, payload });
		} else {
			await createMutation.mutateAsync(payload);
		}
		setModalOpen(false);
		setEditEntry(null);
	};

	const openDelete = (entry: AdminSpellingEntry) => setDeleteEntry(entry);

	const handleDeleteConfirm = async () => {
		if (!deleteEntry) return;
		await deleteMutation.mutateAsync(deleteEntry.id);
		setDeleteEntry(null);
	};

	const isSubmitting = createMutation.isPending || updateMutation.isPending;
	const isDeleting = deleteMutation.isPending;

	return {
		page,
		limit,
		search,
		query,
		total,
		totalPages,
		modalOpen,
		editEntry,
		deleteEntry,
		isSubmitting,
		isDeleting,
		handleSearchChange,
		handleLimitChange,
		setPage,
		openCreate,
		openEdit,
		handleModalSubmit,
		openDelete,
		setDeleteEntry,
		handleDeleteConfirm,
		setModalOpen,
		setEditEntry,
	};
};
