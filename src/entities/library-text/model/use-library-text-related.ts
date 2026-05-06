"use client";

import { useQuery } from "@tanstack/react-query";
import { libraryTextApi, libraryTextKeys } from "../api";

export const useLibraryTextRelated = (id: string) =>
	useQuery({
		queryKey: libraryTextKeys.related(id),
		queryFn: () => libraryTextApi.getRelated(id),
		staleTime: 300_000,
	});
