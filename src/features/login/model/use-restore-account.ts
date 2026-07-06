"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys } from "@/entities/auth";
import type { LoginDto } from "@/entities/auth";

export const useRestoreAccount = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ remember, ...body }: LoginDto & { remember?: boolean }) =>
			authApi.restore({ ...body, rememberMe: remember }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: authKeys.root });
		},
	});
};
