"use client";

import { useQuery } from "@tanstack/react-query";
import { adminBillingApi } from "../api/admin-billing-api";
import { adminBillingKeys } from "../api/admin-billing-keys";
import type { FetchPlansQuery } from "../api/types";

export const useBillingPlans = (query: FetchPlansQuery = {}) =>
	useQuery({
		queryKey: adminBillingKeys.plans(query),
		queryFn: () => adminBillingApi.getPlans(query),
	});
