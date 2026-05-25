"use client";

import { useQuery } from "@tanstack/react-query";
import { deckApi, deckKeys } from "../api";

export interface UseDeckDailyOptions {
	enabled?: boolean;
}

export const useDeckDaily = (options: UseDeckDailyOptions = {}) =>
	useQuery({
		queryKey: deckKeys.daily(),
		queryFn: () => deckApi.daily(),
		enabled: options.enabled ?? true,
		retry: false,
	});
