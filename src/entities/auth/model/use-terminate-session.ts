"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys } from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useTerminateSession = () => {
	const queryClient = useQueryClient();
	const { toastApiError } = useApiErrorToast();

	return useMutation({
		mutationFn: (id: string) => authApi.terminateSession(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
		},
		onError: toastApiError,
	});
};
