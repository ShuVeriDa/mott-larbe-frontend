"use client";

import { useQuery } from "@tanstack/react-query";
import { adminTextApi } from "../api/admin-text-api";
import { adminTextKeys } from "../api/admin-text-keys";

export const useAdminTextStats = () =>
	useQuery({
		queryKey: adminTextKeys.stats(),
		queryFn: () => adminTextApi.stats(),
	});
