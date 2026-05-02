"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminTextApi } from "../api/admin-text-api";
import { adminTextKeys } from "../api/admin-text-keys";

export const useAdminTextVersionMutations = (textId: string) => {
	const qc = useQueryClient();
	const invalidate = () => qc.invalidateQueries({ queryKey: adminTextKeys.versions(textId) });

	const restore = useMutation({
		mutationFn: (versionId: string) => adminTextApi.restoreVersion(textId, versionId),
		onSuccess: invalidate,
	});

	const retry = useMutation({
		mutationFn: (versionId: string) => adminTextApi.retryVersion(textId, versionId),
		onSuccess: invalidate,
	});

	const runTokenization = useMutation({
		mutationFn: () => adminTextApi.tokenize(textId),
		onSuccess: invalidate,
	});

	const download = useMutation({
		mutationFn: (versionId: string) => adminTextApi.downloadVersion(textId, versionId),
	});

	return { restore, retry, runTokenization, download };
};
