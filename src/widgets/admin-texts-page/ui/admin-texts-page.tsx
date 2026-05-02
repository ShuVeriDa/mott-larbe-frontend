"use client";

import { useAdminTextsPage } from "../model/use-admin-texts-page";
import { TextsTopbar } from "./texts-topbar";
import { TextsStatsRow } from "./texts-stats-row";
import { TextsTabs } from "./texts-tabs";
import { TextsToolbar } from "./texts-toolbar";
import { TextsBulkBar } from "./texts-bulk-bar";
import { TextsTable } from "./texts-table";
import { TextsMobileList } from "./texts-mobile-list";
import { TextsPagination } from "./texts-pagination";

export const AdminTextsPage = () => {
	const state = useAdminTextsPage();

	const {
		tab,
		search,
		level,
		sortBy,
		page,
		selectedIds,
		allSelected,
		someSelected,
		data,
		stats,
		isLoading,
		statsLoading,
		mutations,
		handleTabChange,
		handleSearchChange,
		handleLevelChange,
		handleSortChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		setPage,
	} = state;

	const selectedArray = Array.from(selectedIds);
	const bulkPending =
		mutations.bulkPublish.isPending ||
		mutations.bulkTokenize.isPending ||
		mutations.bulkDelete.isPending;

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
			<TextsTopbar />

			<div className="px-[22px] py-4 pb-8 max-sm:px-3.5 max-sm:pb-6">
				<TextsStatsRow stats={stats} isLoading={statsLoading} />

				<TextsTabs
					active={tab}
					stats={stats}
					onChange={handleTabChange}
				/>

				<TextsToolbar
					search={search}
					level={level}
					sortBy={sortBy}
					onSearchChange={handleSearchChange}
					onLevelChange={handleLevelChange}
					onSortChange={handleSortChange}
				/>

				{/* Table card */}
				<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf">
					<TextsBulkBar
						selectedCount={selectedIds.size}
						onPublish={() => mutations.bulkPublish.mutate(selectedArray, { onSuccess: clearSelection })}
						onTokenize={() => mutations.bulkTokenize.mutate(selectedArray, { onSuccess: clearSelection })}
						onDelete={() => mutations.bulkDelete.mutate(selectedArray, { onSuccess: clearSelection })}
						isPending={bulkPending}
					/>

					<TextsTable
						texts={data?.items ?? []}
						selectedIds={selectedIds}
						allSelected={allSelected}
						onToggleAll={toggleSelectAll}
						onToggleRow={toggleSelectId}
						mutations={mutations}
						isLoading={isLoading}
					/>

					<TextsMobileList
						texts={data?.items ?? []}
						mutations={mutations}
						isLoading={isLoading}
					/>

					{!isLoading && data && (
						<TextsPagination
							page={page}
							limit={data.limit}
							total={data.total}
							onPageChange={setPage}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
