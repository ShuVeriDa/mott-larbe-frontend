"use client";

import { useQuery } from "@tanstack/react-query";
import { tokenizationApi } from "../api/token-api";
import { tokenizationKeys } from "../api/token-keys";

export const useTokenizationDistribution = () =>
	useQuery({
		queryKey: tokenizationKeys.distribution(),
		queryFn: tokenizationApi.distribution,
	});
