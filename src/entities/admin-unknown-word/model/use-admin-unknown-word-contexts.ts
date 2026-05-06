"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUnknownWordApi } from "../api/admin-unknown-word-api";
import { adminUnknownWordKeys } from "../api/admin-unknown-word-keys";

export const useAdminUnknownWordContexts = (id: string | null) =>
	useQuery({
		queryKey: adminUnknownWordKeys.contexts(id ?? ""),
		queryFn: () => adminUnknownWordApi.getContexts(id!),
		enabled: !!id,
		staleTime: 30_000,
	});
