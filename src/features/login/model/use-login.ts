"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys, setAccessToken, type LoginDto } from "@/entities/auth";

export const useLogin = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (body: LoginDto) => authApi.login(body),
		onSuccess: (data) => {
			setAccessToken(data.accessToken);
			qc.invalidateQueries({ queryKey: authKeys.root });
		},
	});
};
