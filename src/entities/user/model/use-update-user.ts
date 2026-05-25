"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi, userKeys } from "../api";
import type { UpdateUserDto } from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useUpdateUser = () => {
	const queryClient = useQueryClient();
	const { toastApiError } = useApiErrorToast();

	return useMutation({
		mutationFn: (dto: UpdateUserDto) => userApi.update(dto),
		onSuccess: (updated) => {
			queryClient.setQueryData(userKeys.me(), updated);
		},
		onError: toastApiError,
	});
};
