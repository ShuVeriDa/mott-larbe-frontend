"use client";

import { useQuery } from "@tanstack/react-query";
import { adminCouponApi } from "../api/admin-coupon-api";
import { adminCouponKeys } from "../api/admin-coupon-keys";

export const useCouponDetail = (id: string | null) =>
	useQuery({
		queryKey: adminCouponKeys.detail(id ?? ""),
		queryFn: () => adminCouponApi.getById(id!),
		enabled: !!id,
		staleTime: 15_000,
	});
