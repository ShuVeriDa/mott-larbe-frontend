"use client";

import { useQuery } from "@tanstack/react-query";
import { adminCouponApi } from "../api/admin-coupon-api";
import { adminCouponKeys } from "../api/admin-coupon-keys";
import type { FetchCouponsQuery } from "../api/types";

export const useCoupons = (query: FetchCouponsQuery = {}) =>
	useQuery({
		queryKey: adminCouponKeys.list(query),
		queryFn: () => adminCouponApi.getList(query),
		placeholderData: (prev) => prev,
		staleTime: 15_000,
	});
