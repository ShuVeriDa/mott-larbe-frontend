"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionApi, subscriptionKeys } from "../api";

export const usePlans = () =>
	useQuery({
		queryKey: subscriptionKeys.plans(),
		queryFn: () => subscriptionApi.getPlans(),
	});
