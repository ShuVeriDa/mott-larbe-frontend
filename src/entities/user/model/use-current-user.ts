"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi, userKeys } from "../api";

export const useCurrentUser = () =>
	useQuery({
		queryKey: userKeys.me(),
		queryFn: () => userApi.getMe(),
		staleTime: 60_000,
	});
