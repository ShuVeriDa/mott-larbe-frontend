"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";

export const useAdminUserRoles = (userId: string) => {
	const qc = useQueryClient();
	const invalidate = () =>
		qc.invalidateQueries({ queryKey: adminUserKeys.detail(userId) });

	const assign = useMutation({
		mutationFn: (roleName: import("../api/types").RoleName) =>
			adminUserApi.assignRole(userId, roleName),
		onSuccess: invalidate,
	});

	const revoke = useMutation({
		mutationFn: (roleId: string) => adminUserApi.revokeRole(userId, roleId),
		onSuccess: invalidate,
	});

	return { assign, revoke };
};
