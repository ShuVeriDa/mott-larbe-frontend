"use client";

import { useQuery } from "@tanstack/react-query";
import { tokenizationApi } from "../api/token-api";
import { tokenizationKeys } from "../api/token-keys";

export const useTokenizationStats = () =>
	useQuery({
		queryKey: tokenizationKeys.stats(),
		queryFn: tokenizationApi.stats,
	});
