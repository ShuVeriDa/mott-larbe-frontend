"use client";

import { useState } from "react";
import { useAdminTextDetail } from "@/entities/admin-text/model/use-admin-text-detail";
import { useAdminTextVersions } from "@/entities/admin-text/model/use-admin-text-versions";
import { useAdminTextVersionMutations } from "@/entities/admin-text/model/use-admin-text-version-mutations";
import type { ProcessingStatus } from "@/entities/admin-text";

type StatusFilter = ProcessingStatus | "all";

export const useAdminTextVersionsPage = (textId: string) => {
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

	const textQuery = useAdminTextDetail(textId);

	const versionsQuery = useAdminTextVersions(
		textId,
		statusFilter !== "all" ? statusFilter : undefined,
	);

	const mutations = useAdminTextVersionMutations(textId);

	const versions = versionsQuery.data?.data ?? [];
	const runningCount = versions.filter((v) => v.status === "RUNNING").length;

	return {
		text: textQuery.data,
		textLoading: textQuery.isLoading,
		versionsData: versionsQuery.data,
		versions,
		versionsLoading: versionsQuery.isLoading,
		runningCount,
		statusFilter,
		setStatusFilter,
		selectedVersionId,
		openVersionDetail: (id: string) => setSelectedVersionId(id),
		closeVersionDetail: () => setSelectedVersionId(null),
		restoreVersion: (id: string) => mutations.restore.mutate(id),
		retryVersion: (id: string) => mutations.retry.mutate(id),
		runTokenization: () => mutations.runTokenization.mutate(),
		downloadVersion: (id: string) => mutations.download.mutate(id),
		isRestoring: mutations.restore.isPending,
		isRetrying: mutations.retry.isPending,
		isRunTokenizationPending: mutations.runTokenization.isPending,
	};
};
