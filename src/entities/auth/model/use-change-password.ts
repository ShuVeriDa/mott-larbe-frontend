"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import type { ChangePasswordDto } from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useChangePassword = () => {
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (body: ChangePasswordDto) => authApi.changePassword(body),
		onError: toastApiError,
	});
};
