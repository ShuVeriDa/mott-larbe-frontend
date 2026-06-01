"use client";

import { useQuery } from "@tanstack/react-query";
import { genreApi, genreKeys } from "../api";

export const useGenres = () =>
	useQuery({
		queryKey: genreKeys.list(),
		queryFn: genreApi.list,
		staleTime: 5 * 60_000,
	});

export const useAdminGenres = () =>
	useQuery({
		queryKey: genreKeys.adminList(),
		queryFn: genreApi.adminList,
		staleTime: 60_000,
	});
