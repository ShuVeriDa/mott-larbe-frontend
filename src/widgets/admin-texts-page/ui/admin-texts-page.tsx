"use client";

import { useAdminTextsPage } from "../model/use-admin-texts-page";
import { ImportTextsModal } from "./import-texts-modal";
import { TextsBulkBar } from "./texts-bulk-bar";
import { TextsMobileList } from "./texts-mobile-list";
import { TextsPagination } from "./texts-pagination";
import { TextsStatsRow } from "./texts-stats-row";
import { TextsTable } from "./texts-table";
import { TextsTabs } from "./texts-tabs";
import { TextsToolbar } from "./texts-toolbar";
import { TextsTopbar } from "./texts-topbar";

export const AdminTextsPage = () => {
	const state = useAdminTextsPage();

	const {
		tab,
		search,
		level,
		tagId,
		sortBy,
		page,
		selectedIds,
		allSelected,
		someSelected,
		importOpen,
		data,
		stats,
		isLoading,
		statsLoading,
		mutations,
		handleTabChange,
		handleSearchChange,
		handleLevelChange,
		handleTagChange,
		handleSortChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		setPage,
		setImportOpen,
	} = state;

	const selectedArray = Array.from(selectedIds);
	const bulkPending =
		mutations.bulkPublish.isPending ||
		mutations.bulkTokenize.isPending ||
		mutations.bulkDelete.isPending;

		const handleImportClick: NonNullable<React.ComponentProps<typeof TextsTopbar>["onImportClick"]> = () => setImportOpen(true);
	const handlePublish: NonNullable<React.ComponentProps<typeof TextsBulkBar>["onPublish"]> = () =>
							mutations.bulkPublish.mutate(selectedArray, {
								onSuccess: clearSelection,
							});
	const handleTokenize: NonNullable<React.ComponentProps<typeof TextsBulkBar>["onTokenize"]> = () =>
							mutations.bulkTokenize.mutate(selectedArray, {
								onSuccess: clearSelection,
							});
	const handleDelete: NonNullable<React.ComponentProps<typeof TextsBulkBar>["onDelete"]> = () =>
							mutations.bulkDelete.mutate(selectedArray, {
								onSuccess: clearSelection,
							});
	const handleClose: NonNullable<React.ComponentProps<typeof ImportTextsModal>["onClose"]> = () => setImportOpen(false);
return (
		<div className="flex min-h-0 flex-1 flex-col">
			<TextsTopbar onImportClick={handleImportClick} />

			<div className="overflow-y-auto px-[22px] py-4 pb-8 max-sm:px-3.5 max-sm:pb-6">
				<TextsStatsRow stats={stats} isLoading={statsLoading} />

				<TextsTabs active={tab} stats={stats} onChange={handleTabChange} />

				<TextsToolbar
					search={search}
					level={level}
					tagId={tagId}
					sortBy={sortBy}
					onSearchChange={handleSearchChange}
					onLevelChange={handleLevelChange}
					onTagChange={handleTagChange}
					onSortChange={handleSortChange}
				/>

				{/* Table card */}
				<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
					<TextsBulkBar
						selectedCount={selectedIds.size}
						onPublish={handlePublish
						}
						onTokenize={handleTokenize
						}
						onDelete={handleDelete
						}
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

			{importOpen && <ImportTextsModal onClose={handleClose} />}
		</div>
	);
};
