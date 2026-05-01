"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { subscriptionApi, subscriptionKeys, type PaymentsQuery } from "../api";

export const usePayments = (query: PaymentsQuery = {}) =>
	useQuery({
		queryKey: subscriptionKeys.payments(query),
		queryFn: () => subscriptionApi.getMyPayments(query),
		placeholderData: keepPreviousData,
	});
