"use client";

import { useQuery } from "@tanstack/react-query";
import { libraryTextApi, libraryTextKeys } from "../api";
import type { LibraryTextDetail } from "../api";

export const useLibraryTextDetail = (id: string, initialData?: LibraryTextDetail) =>
	useQuery({
		queryKey: libraryTextKeys.detail(id),
		queryFn: () => libraryTextApi.getById(id),
		staleTime: 60_000,
		...(initialData ? { initialData, initialDataUpdatedAt: Date.now() } : {}),
	});
