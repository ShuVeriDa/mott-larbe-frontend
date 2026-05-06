"use client";

import { useQuery } from "@tanstack/react-query";
import { adminBillingApi } from "../api/admin-billing-api";
import { adminBillingKeys } from "../api/admin-billing-keys";

export const useBillingStats = () =>
	useQuery({
		queryKey: adminBillingKeys.stats(),
		queryFn: adminBillingApi.getStats,
	});
