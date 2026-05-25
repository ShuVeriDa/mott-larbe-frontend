"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import type { EmailChangeRequestDto } from "../api";
import { useApiErrorToast } from "@/shared/lib/api-error-toast";

export const useRequestEmailChange = () => {
	const { toastApiError } = useApiErrorToast();
	return useMutation({
		mutationFn: (body: EmailChangeRequestDto) => authApi.requestEmailChange(body),
		onError: toastApiError,
	});
};
