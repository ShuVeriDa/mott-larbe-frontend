"use client";

import { useQuery } from "@tanstack/react-query";
import { tokenizationApi } from "../api/token-api";
import { tokenizationKeys } from "../api/token-keys";

export const useTokenizationQueue = () =>
	useQuery({
		queryKey: tokenizationKeys.queue(),
		queryFn: tokenizationApi.queue,
		refetchInterval: 5000,
	});
