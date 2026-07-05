"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys } from "@/entities/auth";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useUnlinkAccount = () => {
	const queryClient = useQueryClient();
	const { toastApiError } = useApiErrorToast();

	return useMutation({
		mutationFn: (id: string) => authApi.unlinkAccount(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.linkedAccounts() });
		},
		onError: toastApiError,
	});
};
