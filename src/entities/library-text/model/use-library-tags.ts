"use client";

import { useQuery } from "@tanstack/react-query";
import { libraryTextApi, libraryTextKeys } from "../api";

export const useLibraryTags = () =>
	useQuery({
		queryKey: libraryTextKeys.tags(),
		queryFn: libraryTextApi.getTags,
		staleTime: 5 * 60_000,
	});
