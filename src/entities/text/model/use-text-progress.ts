"use client";

import { useQuery } from "@tanstack/react-query";
import { textApi, textKeys } from "../api";

export const useTextProgress = (textId: string) =>
	useQuery({
		queryKey: textKeys.progress(textId),
		queryFn: () => textApi.getProgress(textId),
		enabled: Boolean(textId),
		staleTime: 30_000,
	});
