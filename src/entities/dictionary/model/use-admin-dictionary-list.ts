"use client";

import { useQuery } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";
import type { AdminDictListQuery } from "../api";

export const useAdminDictionaryList = (query: AdminDictListQuery = {}) =>
	useQuery({
		queryKey: adminDictionaryKeys.list(query),
		queryFn: () => adminDictionaryApi.list(query),
		placeholderData: (prev) => prev,
		staleTime: 15_000,
	});
