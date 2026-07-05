"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys, type TelegramAuthData } from "@/entities/auth";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useLinkTelegramAccount = () => {
	const queryClient = useQueryClient();
	const { toastApiError } = useApiErrorToast();

	return useMutation({
		mutationFn: (data: TelegramAuthData) => authApi.linkTelegramAccount(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.linkedAccounts() });
		},
		onError: toastApiError,
	});
};
