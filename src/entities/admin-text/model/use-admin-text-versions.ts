"use client";

import { useQuery } from "@tanstack/react-query";
import { adminTextApi } from "../api/admin-text-api";
import { adminTextKeys } from "../api/admin-text-keys";
import type { ProcessingStatus } from "../api/types";

export const useAdminTextVersions = (textId: string, status?: ProcessingStatus) =>
	useQuery({
		queryKey: adminTextKeys.versions(textId, status),
		queryFn: () => adminTextApi.getVersions(textId, status),
		placeholderData: (prev) => prev,
		refetchInterval: (query) => {
			const data = query.state.data;
			if (!data) return false;
			const hasRunning = data.data.some((v) => v.status === "RUNNING");
			return hasRunning ? 3000 : false;
		},
	});

export const useAdminTextVersionDetail = (textId: string, versionId: string | null) =>
	useQuery({
		queryKey: adminTextKeys.versionDetail(textId, versionId ?? ""),
		queryFn: () => adminTextApi.getVersionDetail(textId, versionId!),
		enabled: !!versionId,
	});
