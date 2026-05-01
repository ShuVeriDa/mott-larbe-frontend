"use client";

import { useQuery } from "@tanstack/react-query";
import { textApi, textKeys } from "../api";

export const useTextPage = (textId: string, pageNumber: number) =>
	useQuery({
		queryKey: textKeys.page(textId, pageNumber),
		queryFn: () => textApi.getPage(textId, pageNumber),
		enabled: Boolean(textId) && Number.isFinite(pageNumber) && pageNumber > 0,
		staleTime: 60_000,
	});
