"use client";

import { useQuery } from "@tanstack/react-query";
import { adminBillingApi } from "../api/admin-billing-api";
import { adminBillingKeys } from "../api/admin-billing-keys";
import type { FetchCouponsQuery } from "../api/types";

export const useBillingCoupons = (query: FetchCouponsQuery = {}) =>
	useQuery({
		queryKey: adminBillingKeys.coupons(query),
		queryFn: () => adminBillingApi.getCoupons(query),
	});
