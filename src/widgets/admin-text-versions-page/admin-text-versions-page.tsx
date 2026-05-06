"use client";

import { useAdminTextVersionsPage } from "./use-admin-text-versions-page";
import { VersionsTopbar } from "./ui/versions-topbar";
import { VersionsStatsRow } from "./ui/versions-stats-row";
import { VersionsTimeline } from "./ui/versions-timeline";
import { VersionsSidebar } from "./ui/versions-sidebar";
import { VersionDetailModal } from "./ui/version-detail-modal";
import { RunProcessModal } from "./ui/run-process-modal";

interface AdminTextVersionsPageProps {
	textId: string;
}

export const AdminTextVersionsPage = ({ textId }: AdminTextVersionsPageProps) => {
	const page = useAdminTextVersionsPage(textId);

	const isRunning = page.runningCount > 0 || page.isRunProcessPending;

	return (
		<div>
			<VersionsTopbar
				textId={textId}
				text={page.text}
				onRunTokenization={page.openRunModal}
				isRunning={isRunning}
			/>

			<div className="p-[22px] pb-10 max-sm:p-3.5 max-sm:pb-10">
				<VersionsStatsRow
					total={page.versionsData?.total ?? 0}
					successCount={page.versionsData?.successCount ?? 0}
					errorCount={page.versionsData?.errorCount ?? 0}
					currentVersion={page.currentVersion}
					isLoading={page.versionsLoading}
				/>

				<div className="grid grid-cols-[1fr_280px] items-start gap-4 max-md:grid-cols-1">
					<VersionsTimeline
						versions={page.versions}
						statusFilter={page.statusFilter}
						onStatusFilterChange={page.setStatusFilter}
						onVersionClick={page.openVersionDetail}
						onRestore={page.restoreVersion}
						onRetry={page.retryVersion}
						onDownload={page.downloadVersion}
						selectedVersionId={page.selectedVersionId}
						isLoading={page.versionsLoading}
					/>
					<VersionsSidebar
						text={page.text}
						currentVersion={page.currentVersion}
						isLoading={page.textLoading || page.versionsLoading}
						onRunTokenization={page.openRunModal}
						isRunning={isRunning}
					/>
				</div>
			</div>

			{page.selectedVersionId && (
				<VersionDetailModal
					textId={textId}
					versionId={page.selectedVersionId}
					onClose={page.closeVersionDetail}
					onRestore={page.restoreVersion}
					onRetry={page.retryVersion}
					onDownload={page.downloadVersion}
					isRestoring={page.isRestoring}
					isRetrying={page.isRetrying}
				/>
			)}

			{page.runModalOpen && (
				<RunProcessModal
					defaultNormalization={page.text?.useNormalization ?? true}
					defaultMorphAnalysis={page.text?.useMorphAnalysis ?? false}
					isPending={page.isRunProcessPending}
					onConfirm={page.confirmRunProcess}
					onClose={page.closeRunModal}
				/>
			)}
		</div>
	);
};
