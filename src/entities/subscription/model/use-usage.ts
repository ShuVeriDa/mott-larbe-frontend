"use client";

import { useQuery } from "@tanstack/react-query";
import { subscriptionApi, subscriptionKeys } from "../api";

export const useUsage = () =>
	useQuery({
		queryKey: subscriptionKeys.usage(),
		queryFn: () => subscriptionApi.getUsage(),
	});
