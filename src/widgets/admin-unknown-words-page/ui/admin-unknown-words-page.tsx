"use client";

import { ComponentProps } from 'react';
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
import { UnknownWordsContextsModal } from "./unknown-words-contexts-modal";
import type { UnknownWordListItem } from "@/entities/admin-unknown-word";

export const AdminUnknownWordsPage = () => {
	const {
		tab,
		search,
		sort,
		textId,
		page,
		selectedIds,
		allSelected,
		data,
		stats,
		isLoading,
		statsLoading,
		textsData,
		mutations,
		addModal,
		clearModalOpen,
		contextsModal,
		handleTabChange,
		handleSearchChange,
		handleSortChange,
		handleTextChange,
		handlePageChange,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		openAddModal,
		closeAddModal,
		openContextsModal,
		closeContextsModal,
		handleAddToDictionary,
		handleLinkToLemma,
		handleExport,
		handleClearAll,
		setClearModalOpen,
	} = useAdminUnknownWordsPage();

	const selectedArray = Array.from(selectedIds);

	const handleOpenAdd = (word: UnknownWordListItem) => openAddModal(word, "new");
	const handleOpenLink = (word: UnknownWordListItem) => openAddModal(word, "link");

	const handleOpenClearAllModal: NonNullable<ComponentProps<typeof UnknownWordsTopbar>["onClearAll"]> = () =>
		setClearModalOpen(true);
	const handleBulkAddToDictionary: NonNullable<ComponentProps<typeof UnknownWordsBulkBar>["onAddToDictionary"]> = () => {
		if (selectedArray.length === 1 && data?.items) {
			const word = data.items.find(w => w.id === selectedArray[0]);
			if (word) handleOpenAdd(word);
		}
	};
	const handleBulkDelete: NonNullable<ComponentProps<typeof UnknownWordsBulkBar>["onDelete"]> = () =>
		mutations.bulkDelete.mutate(selectedArray, {
			onSuccess: clearSelection,
		});
	const handleClearModalClose: NonNullable<ComponentProps<typeof UnknownWordsClearModal>["onClose"]> = () =>
		setClearModalOpen(false);
return (
		<>
			<div className="flex min-h-0 flex-1 flex-col">
				<UnknownWordsTopbar
					onExport={handleExport}
					onClearAll={handleOpenClearAllModal}
				/>

				<div className="overflow-y-auto px-[18px] py-4 pb-8 max-sm:px-3 max-sm:pb-6">
					<UnknownWordsStatsRow stats={stats} isLoading={statsLoading} />

					<UnknownWordsTabs
						active={tab}
						counts={data?.tabs}
						onChange={handleTabChange}
					/>

					<UnknownWordsToolbar
						search={search}
						sort={sort}
						textId={textId}
						texts={textsData ?? []}
						onSearchChange={handleSearchChange}
						onSortChange={handleSortChange}
						onTextChange={handleTextChange}
					/>

					{/* Table card */}
					<div className="overflow-hidden rounded-card border border-bd-1 bg-surf">
						<UnknownWordsBulkBar
							selectedCount={selectedIds.size}
							onAddToDictionary={handleBulkAddToDictionary}
							onDelete={handleBulkDelete}
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
							onAddToDictionary={handleOpenAdd}
							onLinkToLemma={handleOpenLink}
							onViewContexts={openContextsModal}
						/>

						<UnknownWordsMobileList
							words={data?.items ?? []}
							mutations={mutations}
							isLoading={isLoading}
							onAddToDictionary={handleOpenAdd}
							onLinkToLemma={handleOpenLink}
							onViewContexts={openContextsModal}
						/>

						{!isLoading && data && (
							<UnknownWordsPagination
								page={page}
								limit={data.limit}
								total={data.total}
								onPageChange={handlePageChange}
							/>
						)}
					</div>
				</div>
			</div>

			<UnknownWordsAddModal
				state={addModal}
				isPending={
					mutations.addToDictionary.isPending || mutations.linkToLemma.isPending
				}
				onClose={closeAddModal}
				onSubmit={handleAddToDictionary}
				onLink={handleLinkToLemma}
			/>

			<UnknownWordsClearModal
				open={clearModalOpen}
				totalPending={stats?.totalPending ?? 0}
				isPending={mutations.clearAll.isPending}
				onClose={handleClearModalClose}
				onConfirm={handleClearAll}
			/>

			<UnknownWordsContextsModal
				state={contextsModal}
				onClose={closeContextsModal}
			/>
		</>
	);
};
