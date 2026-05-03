"use client";

import { useQuery } from "@tanstack/react-query";
import { adminDictionaryApi, adminDictionaryKeys } from "../api";

export const useAdminDictionaryStats = () =>
	useQuery({
		queryKey: adminDictionaryKeys.stats(),
		queryFn: () => adminDictionaryApi.stats(),
		staleTime: 30_000,
	});
