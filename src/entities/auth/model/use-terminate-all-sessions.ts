"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, authKeys } from "../api";

export const useTerminateAllSessions = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => authApi.terminateAllSessions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
		},
	});
};
