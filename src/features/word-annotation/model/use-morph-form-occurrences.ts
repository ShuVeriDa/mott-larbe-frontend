"use client";

import { useQuery } from "@tanstack/react-query";
import { annotationApi } from "../api/annotation-api";
import { annotationKeys } from "../api/annotation-keys";

export const useMorphFormOccurrences = (morphFormId: string | undefined) =>
	useQuery({
		queryKey: annotationKeys.morphForms.occurrences(morphFormId ?? ""),
		queryFn: () => annotationApi.getMorphFormOccurrences(morphFormId!),
		enabled: Boolean(morphFormId),
		staleTime: 15_000,
	});
