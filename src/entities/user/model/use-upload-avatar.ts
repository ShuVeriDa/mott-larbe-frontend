"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, userKeys } from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useUploadAvatar = () => {
	const queryClient = useQueryClient();
	const { toastApiError } = useApiErrorToast();

	return useMutation({
		mutationFn: (file: File) => userApi.uploadAvatar(file),
		onSuccess: (updatedProfile) => {
			queryClient.setQueryData(userKeys.me(), updatedProfile);
		},
		onError: toastApiError,
	});
};
