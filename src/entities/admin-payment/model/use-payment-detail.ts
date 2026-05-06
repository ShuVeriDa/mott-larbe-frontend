"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentApi } from "../api/admin-payment-api";
import { adminPaymentKeys } from "../api/admin-payment-keys";

export const usePaymentDetail = (id: string | null) =>
	useQuery({
		queryKey: adminPaymentKeys.detail(id ?? ""),
		queryFn: () => adminPaymentApi.getById(id!),
		enabled: !!id,
		staleTime: 30 * 1000,
	});
