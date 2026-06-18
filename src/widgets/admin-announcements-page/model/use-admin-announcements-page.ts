"use client";

import { useState } from "react";
import {
	announcementListQueryOptions,
	useCreateAnnouncement,
	useDeleteAnnouncement,
	type Announcement,
	type CreateAnnouncementPayload,
} from "@/entities/announcement";
import { useQuery } from "@tanstack/react-query";

export const useAdminAnnouncementsPage = () => {
	const [modalOpen, setModalOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Announcement | null>(null);

	const query = useQuery(announcementListQueryOptions());

	const createMutation = useCreateAnnouncement();
	const deleteMutation = useDeleteAnnouncement();

	const announcements = query.data ?? [];

	const handleOpenCreate = () => setModalOpen(true);

	const handleModalClose = () => setModalOpen(false);

	const handleCreate = async (payload: CreateAnnouncementPayload) => {
		await createMutation.mutateAsync(payload);
		setModalOpen(false);
	};

	const handleOpenDelete = (announcement: Announcement) =>
		setDeleteTarget(announcement);

	const handleDeleteClose = () => setDeleteTarget(null);

	const handleDeleteConfirm = async () => {
		if (!deleteTarget) return;
		await deleteMutation.mutateAsync(deleteTarget.id);
		setDeleteTarget(null);
	};

	return {
		announcements,
		query,
		modalOpen,
		deleteTarget,
		isCreating: createMutation.isPending,
		isDeleting: deleteMutation.isPending,
		handleOpenCreate,
		handleModalClose,
		handleCreate,
		handleOpenDelete,
		handleDeleteClose,
		handleDeleteConfirm,
	};
};
