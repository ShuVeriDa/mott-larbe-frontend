"use client";

import { useQuery } from "@tanstack/react-query";
import { deckApi, deckKeys } from "../api";

export interface UseDeckStatsOptions {
	enabled?: boolean;
}

export const useDeckStats = (options: UseDeckStatsOptions = {}) =>
	useQuery({
		queryKey: deckKeys.stats(),
		queryFn: () => deckApi.stats(),
		enabled: options.enabled ?? true,
		retry: false,
	});
