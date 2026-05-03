"use client";

import { useQuery } from "@tanstack/react-query";
import { adminSubscriptionApi } from "../api/admin-subscription-api";
import { adminSubscriptionKeys } from "../api/admin-subscription-keys";
import type { FetchSubscriptionsQuery } from "../api/types";

export const useAdminSubscriptions = (query: FetchSubscriptionsQuery = {}) =>
	useQuery({
		queryKey: adminSubscriptionKeys.list(query),
		queryFn: () => adminSubscriptionApi.list(query),
		placeholderData: (prev) => prev,
	});
