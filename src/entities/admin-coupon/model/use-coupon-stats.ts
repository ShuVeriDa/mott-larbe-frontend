"use client";

import { useQuery } from "@tanstack/react-query";
import { adminCouponApi } from "../api/admin-coupon-api";
import { adminCouponKeys } from "../api/admin-coupon-keys";

export const useCouponStats = () =>
	useQuery({
		queryKey: adminCouponKeys.stats(),
		queryFn: adminCouponApi.getStats,
		staleTime: 30_000,
	});
