"use client";

import { useQuery } from "@tanstack/react-query";
import { adminUnknownWordApi } from "../api/admin-unknown-word-api";
import { adminUnknownWordKeys } from "../api/admin-unknown-word-keys";

export const useAdminTextsDropdown = () =>
	useQuery({
		queryKey: adminUnknownWordKeys.texts(),
		queryFn: adminUnknownWordApi.getTexts,
		staleTime: 60_000,
	});
