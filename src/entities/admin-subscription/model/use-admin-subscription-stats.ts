"use client";

import { useQuery } from "@tanstack/react-query";
import { adminSubscriptionApi } from "../api/admin-subscription-api";
import { adminSubscriptionKeys } from "../api/admin-subscription-keys";

export const useAdminSubscriptionStats = () =>
	useQuery({
		queryKey: adminSubscriptionKeys.stats(),
		queryFn: adminSubscriptionApi.stats,
	});
