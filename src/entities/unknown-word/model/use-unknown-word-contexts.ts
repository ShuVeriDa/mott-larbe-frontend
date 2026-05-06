"use client";

import { useQuery } from "@tanstack/react-query";
import { unknownWordApi } from "../api/unknown-word-api";
import { unknownWordKeys } from "../api/unknown-word-keys";

export const useUnknownWordContexts = (id: string | null) =>
	useQuery({
		queryKey: unknownWordKeys.contexts(id ?? ""),
		queryFn: () => unknownWordApi.getContexts(id!),
		enabled: !!id,
		staleTime: 30_000,
	});
