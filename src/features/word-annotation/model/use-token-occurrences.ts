import { useQuery } from "@tanstack/react-query";
import { annotationApi } from "../api/annotation-api";
import { annotationKeys } from "../api/annotation-keys";

export const useTokenOccurrences = (normalized: string, textId: string | undefined) =>
	useQuery({
		queryKey: annotationKeys.tokenOccurrences(normalized, textId ?? ""),
		queryFn: () => annotationApi.getTokenOccurrences(normalized, textId!),
		enabled: normalized.trim().length >= 1 && Boolean(textId),
		staleTime: 30_000,
	});
