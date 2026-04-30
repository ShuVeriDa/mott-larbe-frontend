"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi, authKeys } from "@/entities/auth";

export const useValidateResetToken = (token: string | null) =>
	useQuery({
		queryKey: authKeys.passwordResetValidate(token ?? ""),
		queryFn: () => authApi.validatePasswordResetToken(token ?? ""),
		enabled: Boolean(token),
		retry: false,
		staleTime: 30_000,
	});
