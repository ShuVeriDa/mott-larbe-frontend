"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionApi, subscriptionKeys } from "../api";

export const useMySubscription = () =>
	useQuery({
		queryKey: subscriptionKeys.me(),
		queryFn: () => subscriptionApi.getMySubscription(),
	});
