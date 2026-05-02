"use client";

import { useQuery } from "@tanstack/react-query";
import { adminTextApi } from "../api/admin-text-api";
import { adminTextKeys } from "../api/admin-text-keys";
import type { FetchAdminTextsQuery } from "../api/types";

export const useAdminTexts = (query: FetchAdminTextsQuery = {}) =>
	useQuery({
		queryKey: adminTextKeys.list(query),
		queryFn: () => adminTextApi.list(query),
		placeholderData: (prev) => prev,
	});
