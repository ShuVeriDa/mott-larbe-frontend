"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUnknownWordApi } from "../api/admin-unknown-word-api";
import { adminUnknownWordKeys } from "../api/admin-unknown-word-keys";

export const useAdminUnknownWordStats = () =>
	useQuery({
		queryKey: adminUnknownWordKeys.stats(),
		queryFn: adminUnknownWordApi.stats,
		staleTime: 30_000,
	});
