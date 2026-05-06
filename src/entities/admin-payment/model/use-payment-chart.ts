"use client";

import { useQuery } from "@tanstack/react-query";
import { adminPaymentApi } from "../api/admin-payment-api";
import { adminPaymentKeys } from "../api/admin-payment-keys";
import type { FetchPaymentChartQuery } from "../api/types";

export const usePaymentChart = (query: FetchPaymentChartQuery = {}) =>
	useQuery({
		queryKey: adminPaymentKeys.chart(query),
		queryFn: () => adminPaymentApi.getChart(query),
		staleTime: 5 * 60 * 1000,
	});
