"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";

export const useAdminUserStats = () =>
	useQuery({
		queryKey: adminUserKeys.stats(),
		queryFn: adminUserApi.stats,
	});
