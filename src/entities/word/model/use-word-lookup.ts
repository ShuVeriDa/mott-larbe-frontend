"use client";

import { useQuery } from "@tanstack/react-query";
import { wordApi, wordKeys } from "../api";

export const useWordLookup = (tokenId: string | null) =>
	useQuery({
		queryKey: tokenId ? wordKeys.lookup(tokenId) : ["word", "lookup", "_"],
		queryFn: () => wordApi.lookup(tokenId as string),
		enabled: Boolean(tokenId),
		staleTime: 5 * 60_000,
	});
