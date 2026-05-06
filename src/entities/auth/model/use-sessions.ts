"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi, authKeys } from "../api";

export const useSessions = () =>
	useQuery({
		queryKey: authKeys.sessions(),
		queryFn: () => authApi.getSessions(),
		staleTime: 30_000,
	});
