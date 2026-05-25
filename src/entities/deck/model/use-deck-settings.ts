"use client";

import { useQuery } from "@tanstack/react-query";
import { deckApi, deckKeys } from "../api";

export interface UseDeckSettingsOptions {
	enabled?: boolean;
}

export const useDeckSettings = (options: UseDeckSettingsOptions = {}) =>
	useQuery({
		queryKey: deckKeys.settings(),
		queryFn: () => deckApi.getSettings(),
		enabled: options.enabled ?? true,
		retry: false,
	});
