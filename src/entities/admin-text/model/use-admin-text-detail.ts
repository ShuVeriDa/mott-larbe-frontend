"use client";

import { useQuery } from "@tanstack/react-query";
import { adminTextApi } from "../api/admin-text-api";
import { adminTextKeys } from "../api/admin-text-keys";

export const useAdminTextDetail = (id: string) =>
	useQuery({
		queryKey: adminTextKeys.detail(id),
		queryFn: () => adminTextApi.getById(id),
		enabled: Boolean(id),
		staleTime: 30_000,
	});
