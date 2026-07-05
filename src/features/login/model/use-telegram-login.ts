"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys, type TelegramAuthData } from "@/entities/auth";

export const useTelegramLogin = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: TelegramAuthData) => authApi.loginWithTelegram(data),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: authKeys.root });
		},
	});
};
