"use client";

import { useQuery } from "@tanstack/react-query";
import { adminSubscriptionApi } from "../api/admin-subscription-api";
import { adminSubscriptionKeys } from "../api/admin-subscription-keys";

export const useAdminSubscriptionDetail = (id: string | null) =>
	useQuery({
		queryKey: adminSubscriptionKeys.detail(id ?? ""),
		queryFn: () => adminSubscriptionApi.getById(id!),
		enabled: !!id,
	});
