"use client";

import { useQuery } from "@tanstack/react-query";
import { adminBillingApi } from "../api/admin-billing-api";
import { adminBillingKeys } from "../api/admin-billing-keys";
import type { FetchSubscriptionsQuery } from "../api/types";

export const useBillingSubscriptions = (query: FetchSubscriptionsQuery = {}) =>
	useQuery({
		queryKey: adminBillingKeys.subscriptions(query),
		queryFn: () => adminBillingApi.getSubscriptions(query),
		placeholderData: (prev) => prev,
	});
