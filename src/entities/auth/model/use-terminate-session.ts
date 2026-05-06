"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys } from "../api";

export const useTerminateSession = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => authApi.terminateSession(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
		},
	});
};
