"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUnknownWordApi } from "../api/admin-unknown-word-api";
import { adminUnknownWordKeys } from "../api/admin-unknown-word-keys";
import type { FetchUnknownWordsQuery } from "../api/types";

export const useAdminUnknownWords = (query: FetchUnknownWordsQuery = {}) =>
	useQuery({
		queryKey: adminUnknownWordKeys.list(query),
		queryFn: () => adminUnknownWordApi.list(query),
		placeholderData: (prev) => prev,
	});
