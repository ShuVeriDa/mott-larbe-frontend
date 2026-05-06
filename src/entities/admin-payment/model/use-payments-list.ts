"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentApi } from "../api/admin-payment-api";
import { adminPaymentKeys } from "../api/admin-payment-keys";
import type { FetchPaymentsQuery } from "../api/types";

export const usePaymentsList = (query: FetchPaymentsQuery = {}) =>
	useQuery({
		queryKey: adminPaymentKeys.list(query),
		queryFn: () => adminPaymentApi.list(query),
		staleTime: 30 * 1000,
		placeholderData: (prev) => prev,
	});
