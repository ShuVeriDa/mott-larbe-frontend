"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys, clearAccessToken } from "@/entities/auth";
import { userKeys } from "@/entities/user";

export const useLogout = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => authApi.logout(),
		onSuccess: () => {
			clearAccessToken();
			qc.removeQueries({ queryKey: authKeys.root });
			qc.removeQueries({ queryKey: userKeys.me() });
		},
	});
};
