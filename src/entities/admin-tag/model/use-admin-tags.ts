"use client";

import { useQuery } from "@tanstack/react-query";
import { adminTagApi } from "../api/admin-tag-api";
import { adminTagKeys } from "../api/admin-tag-keys";

export const useAdminTags = () =>
	useQuery({
		queryKey: adminTagKeys.list(),
		queryFn: adminTagApi.list,
		staleTime: Infinity,
	});
