"use client";

import { useAdminUnknownWordsPage } from "../model/use-admin-unknown-words-page";
import { UnknownWordsTopbar } from "./unknown-words-topbar";
import { UnknownWordsStatsRow } from "./unknown-words-stats-row";
import { UnknownWordsTabs } from "./unknown-words-tabs";
import { UnknownWordsToolbar } from "./unknown-words-toolbar";
import { UnknownWordsBulkBar } from "./unknown-words-bulk-bar";
import { UnknownWordsTable } from "./unknown-words-table";
import { UnknownWordsMobileList } from "./unknown-words-mobile-list";
import { UnknownWordsPagination } from "./unknown-words-pagination";
import { UnknownWordsAddModal } from "./unknown-words-add-modal";
import { UnknownWordsClearModal } from "./unknown-words-clear-modal";
import type { UnknownWordListItem } from "@/entities/unknown-word";

export const AdminUnknownWordsPage = () => {
	const state = useAdminUnknownWordsPage();

	const {
		tab,
		search,
		sort,
		page,
		selectedIds,
		allSelected,
		data,
		stats,
		isLoading,
		statsLoading,
		mutations,
		addModal,
		clearModalOpen,
		handleTabChange,
		handleSearchChange,
		handleSortChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		setPage,
		openAddModal,
		closeAddModal,
		handleAddToDictionary,
		handleExport,
		handleClearAll,
		setClearModalOpen,
	} = state;

	const selectedArray = Array.from(selectedIds);

	const handleOpenAddModal = (word: UnknownWordListItem) => {
		openAddModal(word.id, word.word, word.normalized, word.seenCount, word.snippet ?? null);
	};

	return (
		<>
			<div className="flex min-h-0 flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:w-0">
				<UnknownWordsTopbar
					onExport={handleExport}
					onClearAll={() => setClearModalOpen(true)}
				/>

				<div className="px-[18px] py-4 pb-8 max-sm:px-3 max-sm:pb-6">
					<UnknownWordsStatsRow stats={stats} isLoading={statsLoading} />

					<UnknownWordsTabs
						active={tab}
						counts={data?.tabs}
						onChange={handleTabChange}
					/>

					<UnknownWordsToolbar
						search={search}
						sort={sort}
						onSearchChange={handleSearchChange}
						onSortChange={handleSortChange}
					/>

					{/* Table card */}
					<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf">
						<UnknownWordsBulkBar
							selectedCount={selectedIds.size}
							onAddToDictionary={() => {
								if (selectedArray.length === 1 && data?.items) {
									const word = data.items.find((w) => w.id === selectedArray[0]);
									if (word) handleOpenAddModal(word);
								}
							}}
							onDelete={() =>
								mutations.bulkDelete.mutate(selectedArray, {
									onSuccess: clearSelection,
								})
							}
							isPending={mutations.bulkDelete.isPending}
						/>

						<UnknownWordsTable
							words={data?.items ?? []}
							selectedIds={selectedIds}
							allSelected={allSelected}
							onToggleAll={toggleSelectAll}
							onToggleRow={toggleSelectId}
							mutations={mutations}
							isLoading={isLoading}
							onAddToDictionary={handleOpenAddModal}
						/>

						<UnknownWordsMobileList
							words={data?.items ?? []}
							mutations={mutations}
							isLoading={isLoading}
							onAddToDictionary={handleOpenAddModal}
						/>

						{!isLoading && data && (
							<UnknownWordsPagination
								page={page}
								limit={data.limit}
								total={data.total}
								onPageChange={setPage}
							/>
						)}
					</div>
				</div>
			</div>

			<UnknownWordsAddModal
				state={addModal}
				isPending={mutations.addToDictionary.isPending}
				onClose={closeAddModal}
				onSubmit={handleAddToDictionary}
			/>

			<UnknownWordsClearModal
				open={clearModalOpen}
				totalPending={stats?.totalPending ?? 0}
				isPending={mutations.clearAll.isPending}
				onClose={() => setClearModalOpen(false)}
				onConfirm={handleClearAll}
			/>
		</>
	);
};
