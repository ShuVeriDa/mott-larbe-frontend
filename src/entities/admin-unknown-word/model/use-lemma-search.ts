"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUnknownWordApi } from "../api/admin-unknown-word-api";
import { adminUnknownWordKeys } from "../api/admin-unknown-word-keys";

export const useLemmaSearch = (q: string) =>
	useQuery({
		queryKey: adminUnknownWordKeys.lemmas(q),
		queryFn: () => adminUnknownWordApi.searchLemmas(q),
		enabled: q.length >= 1,
		staleTime: 30_000,
	});
