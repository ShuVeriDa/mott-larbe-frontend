"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUserApi } from "../api/admin-user-api";
import { adminUserKeys } from "../api/admin-user-keys";
import type { FetchAdminUsersQuery } from "../api/types";

export const useAdminUsers = (query: FetchAdminUsersQuery = {}) =>
	useQuery({
		queryKey: adminUserKeys.list(query),
		queryFn: () => adminUserApi.list(query),
		placeholderData: (prev) => prev,
	});
