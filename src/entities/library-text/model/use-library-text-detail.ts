"use client";

import { useQuery } from "@tanstack/react-query";
import { libraryTextApi, libraryTextKeys } from "../api";
import type { LibraryTextDetail } from "../api";

export const useLibraryTextDetail = (id: string) =>
	useQuery({
		queryKey: libraryTextKeys.detail(id),
		queryFn: () => libraryTextApi.getById(id),
		staleTime: 30_000,
	});
