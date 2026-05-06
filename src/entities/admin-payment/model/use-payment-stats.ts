"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentApi } from "../api/admin-payment-api";
import { adminPaymentKeys } from "../api/admin-payment-keys";

export const usePaymentStats = () =>
	useQuery({
		queryKey: adminPaymentKeys.stats(),
		queryFn: () => adminPaymentApi.getStats(),
		staleTime: 5 * 60 * 1000,
	});
