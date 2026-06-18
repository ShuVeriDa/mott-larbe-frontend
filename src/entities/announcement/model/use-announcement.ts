"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementApi } from "../api/announcement-api";
import { announcementKeys } from "../api/announcement-keys";

export const useCreateAnnouncement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: announcementApi.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: announcementKeys.all });
		},
	});
};

export const useDeleteAnnouncement = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: announcementApi.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: announcementKeys.all });
		},
	});
};
