"use client";

import { useState } from "react";
import { useAdminTextDetail } from "@/entities/admin-text/model/use-admin-text-detail";
import { useAdminTextVersions } from "@/entities/admin-text/model/use-admin-text-versions";
import { useAdminTextVersionMutations } from "@/entities/admin-text/model/use-admin-text-version-mutations";
import { useAdminTextSSE } from "@/entities/admin-text/model/use-admin-text-sse";
import type { ProcessingStatus, ProcessTextDto } from "@/entities/admin-text";

type StatusFilter = ProcessingStatus | "all";

export const useAdminTextVersionsPage = (textId: string) => {
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
	const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
	const [runModalOpen, setRunModalOpen] = useState(false);

	const textQuery = useAdminTextDetail(textId);

	const versionsQuery = useAdminTextVersions(
		textId,
		statusFilter !== "all" ? statusFilter : undefined,
	);

	const mutations = useAdminTextVersionMutations(textId);

	const versions = versionsQuery.data?.data ?? [];
	const runningCount = versions.filter((v) => v.status === "RUNNING").length;
	const currentVersion = versions.find((v) => v.isCurrent) ?? null;

	const isSSEEnabled = runningCount > 0 || mutations.runProcess.isPending;
	useAdminTextSSE(textId, isSSEEnabled);

	const openRunModal = () => setRunModalOpen(true);
	const closeRunModal = () => setRunModalOpen(false);

	const confirmRunProcess = (dto: ProcessTextDto) => {
		mutations.runProcess.mutate(dto, { onSuccess: closeRunModal });
	};

	return {
		text: textQuery.data,
		textLoading: textQuery.isLoading,
		versionsData: versionsQuery.data,
		versions,
		versionsLoading: versionsQuery.isLoading,
		runningCount,
		currentVersion,
		statusFilter,
		setStatusFilter,
		selectedVersionId,
		openVersionDetail: (id: string) => setSelectedVersionId(id),
		closeVersionDetail: () => setSelectedVersionId(null),
		restoreVersion: (id: string) => mutations.restore.mutate(id),
		retryVersion: (id: string) => mutations.retry.mutate(id),
		downloadVersion: (versionId: string, versionNumber?: number) =>
			mutations.download.mutate({ versionId, versionNumber }),
		runModalOpen,
		openRunModal,
		closeRunModal,
		confirmRunProcess,
		isRestoring: mutations.restore.isPending,
		isRetrying: mutations.retry.isPending,
		isRunProcessPending: mutations.runProcess.isPending,
	};
};
