"use client";

import { useMutation } from "@tanstack/react-query";
import { settingsApi } from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useDeleteAccount = () => {
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (confirmEmail: string) =>
			settingsApi.deleteAccount(confirmEmail),
		onError: toastApiError,
	});
};
