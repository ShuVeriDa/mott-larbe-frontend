"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys } from "@/entities/auth";
import { userKeys } from "@/entities/user";

export const useLogout = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => authApi.logout(),
		onSuccess: () => {
			qc.removeQueries({ queryKey: authKeys.root });
			qc.removeQueries({ queryKey: userKeys.me() });
		},
	});
};
