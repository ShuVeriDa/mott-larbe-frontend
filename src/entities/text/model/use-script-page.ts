"use client";

import { useQuery } from "@tanstack/react-query";
import { textApi, textKeys } from "../api";

export const useScriptPage = (
	textId: string,
	pageNumber: number,
	script: string | null,
) =>
	useQuery({
		queryKey: textKeys.scriptPage(textId, pageNumber, script ?? ""),
		queryFn: () => textApi.getScriptPage(textId, pageNumber, script!),
		enabled: Boolean(textId) && Number.isFinite(pageNumber) && pageNumber > 0 && Boolean(script),
		staleTime: 1000 * 60 * 30,
		placeholderData: (prev) => prev,
	});
