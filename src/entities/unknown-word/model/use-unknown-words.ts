"use client";

import { useQuery } from "@tanstack/react-query";
import { unknownWordApi } from "../api/unknown-word-api";
import { unknownWordKeys } from "../api/unknown-word-keys";
import type { FetchUnknownWordsQuery } from "../api/types";

export const useUnknownWords = (query: FetchUnknownWordsQuery = {}) =>
	useQuery({
		queryKey: unknownWordKeys.list(query),
		queryFn: () => unknownWordApi.list(query),
		placeholderData: (prev) => prev,
	});
