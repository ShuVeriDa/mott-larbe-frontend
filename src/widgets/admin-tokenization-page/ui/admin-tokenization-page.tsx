"use client";

import { useAdminTokenizationPage } from "../model/use-admin-tokenization-page";
import { TokenizationTopbar } from "./tokenization-topbar";
import { TokenizationStatsRow } from "./tokenization-stats-row";
import { TokenizationTabs } from "./tokenization-tabs";
import { TokenizationToolbar } from "./tokenization-toolbar";
import { TokenizationBulkBar } from "./tokenization-bulk-bar";
import { TokenizationTable } from "./tokenization-table";
import { TokenizationMobileList } from "./tokenization-mobile-list";
import { TokenizationPagination } from "./tokenization-pagination";
import { TokenizationSidePanel } from "./tokenization-side-panel";
import { TokenizationRunModal } from "./tokenization-run-modal";
import { TokenizationTextDetailModal } from "./tokenization-text-detail-modal";
import { TokenizationConfirmDialog } from "./tokenization-confirm-dialog";

export const AdminTokenizationPage = () => {
	const {
		tab,
		searchInput,
		level,
		status,
		sort,
		page,
		selectedIds,
		allSelected,
		someSelected,
		data,
		stats,
		distribution,
		settings,
		queue,
		isLoading,
		mutations,
		runModalOpen,
		setRunModalOpen,
		detailTextId,
		setDetailTextId,
		confirmResetOpen,
		setConfirmResetOpen,
		handleTabChange,
		handleSearchChange,
		handleLevelChange,
		handleStatusChange,
		handleSortChange,
		handlePageChange,
		toggleSelectId,
		toggleSelectAll,
		handleRun,
		handleBulkRun,
		handleBulkReset,
		handleSettingToggle,
	} = useAdminTokenizationPage();

	const items = data?.data ?? [];

	return (
		<>
			<TokenizationTopbar
				onRun={() => setRunModalOpen(true)}
				onBatchRun={() => setRunModalOpen(true)}
			/>

			<div className="px-5 py-5 pb-16">
				<TokenizationStatsRow stats={stats} />

				<div className="grid grid-cols-[1fr_260px] items-start gap-3.5 max-md:grid-cols-1">
					{/* Left — main table */}
					<div>
						<TokenizationTabs activeTab={tab} stats={stats} onChange={handleTabChange} />
						<TokenizationToolbar
							search={searchInput}
							level={level}
							status={status}
							sort={sort}
							onSearchChange={handleSearchChange}
							onLevelChange={handleLevelChange}
							onStatusChange={handleStatusChange}
							onSortChange={handleSortChange}
						/>

						<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
							<TokenizationBulkBar
								selectedCount={selectedIds.size}
								onRun={handleBulkRun}
								onReset={() => setConfirmResetOpen(true)}
								isLoading={mutations.bulkRun.isPending || mutations.bulkReset.isPending}
							/>

							<TokenizationTable
								items={items}
								selectedIds={selectedIds}
								allSelected={allSelected}
								isLoading={isLoading}
								onToggleAll={toggleSelectAll}
								onToggleRow={toggleSelectId}
								onRowClick={setDetailTextId}
								mutations={mutations}
							/>

							<TokenizationMobileList items={items} onRowClick={setDetailTextId} />

							{data && data.total > data.limit && (
								<TokenizationPagination
									page={page}
									total={data.total}
									limit={data.limit}
									onPageChange={handlePageChange}
								/>
							)}
						</div>
					</div>

					{/* Right — side panel */}
					<TokenizationSidePanel
						distribution={distribution}
						settings={settings}
						queue={queue}
						onToggleSetting={handleSettingToggle}
						onRun={() => setRunModalOpen(true)}
					/>
				</div>
			</div>

			<TokenizationRunModal
				open={runModalOpen}
				isLoading={mutations.run.isPending}
				stats={stats}
				onClose={() => setRunModalOpen(false)}
				onRun={handleRun}
			/>

			<TokenizationConfirmDialog
				open={confirmResetOpen}
				count={selectedIds.size}
				isLoading={mutations.bulkReset.isPending}
				onConfirm={handleBulkReset}
				onClose={() => setConfirmResetOpen(false)}
			/>

			<TokenizationTextDetailModal
				textId={detailTextId}
				onClose={() => setDetailTextId(null)}
				mutations={mutations}
			/>
		</>
	);
};
