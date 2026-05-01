"use client";

import { useQuery } from "@tanstack/react-query";
import { deckApi, deckKeys } from "../api";

export interface UseDeckDueOptions {
	enabled?: boolean;
}

export const useDeckDue = (options: UseDeckDueOptions = {}) =>
	useQuery({
		queryKey: deckKeys.due(),
		queryFn: () => deckApi.due(),
		enabled: options.enabled ?? true,
		retry: false,
	});
