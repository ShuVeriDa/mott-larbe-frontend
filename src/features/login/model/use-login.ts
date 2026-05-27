"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys, setAccessToken } from "@/entities/auth";
import type { LoginDto } from "@/entities/auth";

export const useLogin = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ remember, ...body }: LoginDto & { remember?: boolean }) =>
			authApi.login({ ...body, rememberMe: remember }),
		onSuccess: (data, variables) => {
			setAccessToken(data.accessToken, variables.remember ?? false);
			qc.invalidateQueries({ queryKey: authKeys.root });
		},
	});
};
