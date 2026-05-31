"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys, type RegisterDto } from "@/entities/auth";

export const useRegister = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: RegisterDto) => authApi.register(body),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: authKeys.root });
		},
	});
};
