"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";

export const useAdminUserSessions = (userId: string) => {
	const qc = useQueryClient();

	const query = useQuery({
		queryKey: adminUserKeys.sessions(userId),
		queryFn: () => adminUserApi.getSessions(userId),
		enabled: !!userId,
	});

	const logoutAll = useMutation({
		mutationFn: () => adminUserApi.logoutAll(userId),
		onSuccess: () => qc.invalidateQueries({ queryKey: adminUserKeys.sessions(userId) }),
	});

	return { query, logoutAll };
};
