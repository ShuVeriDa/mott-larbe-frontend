"use client";

import { useQuery } from "@tanstack/react-query";
import { tokenizationApi } from "../api/token-api";
import { tokenizationKeys } from "../api/token-keys";
import type { FetchTokenizationTextsQuery } from "../api/types";

export const useTokenizationTexts = (query: FetchTokenizationTextsQuery = {}) =>
	useQuery({
		queryKey: tokenizationKeys.list(query),
		queryFn: () => tokenizationApi.list(query),
		placeholderData: (prev) => prev,
	});
