"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";

export const useAdminUserDetail = (id: string) =>
	useQuery({
		queryKey: adminUserKeys.detail(id),
		queryFn: () => adminUserApi.getById(id),
		enabled: !!id,
	});
