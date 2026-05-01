"use client";

import { useQuery } from "@tanstack/react-query";
import { settingsApi, settingsKeys } from "../api";

export const useSettings = () =>
	useQuery({
		queryKey: settingsKeys.all(),
		queryFn: () => settingsApi.getAll(),
		staleTime: 60_000,
	});
