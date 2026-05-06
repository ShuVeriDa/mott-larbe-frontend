"use client";

import { useQuery } from "@tanstack/react-query";
import { adminBillingApi } from "../api/admin-billing-api";
import { adminBillingKeys } from "../api/admin-billing-keys";

export const useBillingSubscriptionStats = () =>
	useQuery({
		queryKey: adminBillingKeys.subscriptionStats(),
		queryFn: () => adminBillingApi.getSubscriptionStats(),
		staleTime: 30_000,
	});
