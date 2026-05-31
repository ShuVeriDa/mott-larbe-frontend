"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys } from "@/entities/auth";
import type { LoginDto } from "@/entities/auth";

export const useLogin = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ remember, ...body }: LoginDto & { remember?: boolean }) =>
			authApi.login({ ...body, rememberMe: remember }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: authKeys.root });
		},
	});
};
