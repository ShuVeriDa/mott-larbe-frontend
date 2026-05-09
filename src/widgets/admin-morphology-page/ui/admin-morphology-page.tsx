"use client";

import type { ImportMorphRulesResult } from "@/entities/morph-rule";import { ComponentProps, useState } from 'react';
import { useAdminMorphologyPage } from "../model/use-admin-morphology-page";
import { MorphologyBulkBar } from "./morphology-bulk-bar";
import { MorphologyImportModal } from "./morphology-import-modal";
import { MorphologyMobileList } from "./morphology-mobile-list";
import { MorphologyPagination } from "./morphology-pagination";
import { MorphologyRuleModal } from "./morphology-rule-modal";
import { MorphologyStatsRow } from "./morphology-stats-row";
import { MorphologyTable } from "./morphology-table";
import { MorphologyTabs } from "./morphology-tabs";
import { MorphologyToolbar } from "./morphology-toolbar";
import { MorphologyTopbar } from "./morphology-topbar";

const LIMIT = 50;

export const AdminMorphologyPage = () => {
	const {
		status,
		search,
		pos,
		type,
		page,
		totalPages,
		total,
		items,
		selectedIds,
		allSelected,
		someSelected,
		statsQuery,
		rulesQuery,
		ruleModalOpen,
		editRule,
		importModalOpen,
		createMutation,
		updateMutation,
		deleteMutation,
		bulkActivateMutation,
		bulkDeactivateMutation,
		bulkDeleteMutation,
		importMutation,
		handleStatusChange,
		handleSearchChange,
		handlePosChange,
		handleTypeChange,
		setPage,
		toggleSelectId,
		toggleSelectAll,
		clearSelection,
		openAddModal,
		openEditModal,
		closeRuleModal,
		handleRuleSubmit,
		handleToggleActive,
		handleDelete,
		setImportModalOpen,
	} = useAdminMorphologyPage();

	const [importResult, setImportResult] =
		useState<ImportMorphRulesResult | null>(null);

	const handleImportSubmit = (file: File, overwrite: boolean) => {
		importMutation.mutate(
			{ file, overwrite },
			{
				onSuccess: result => setImportResult(result),
			},
		);
	};

	const handleImportClose = () => {
		setImportModalOpen(false);
		setImportResult(null);
	};

	const handleOpenImport: NonNullable<ComponentProps<typeof MorphologyTopbar>["onImport"]> = () =>
		setImportModalOpen(true);
	const handleBulkActivate: NonNullable<ComponentProps<typeof MorphologyBulkBar>["onActivate"]> = () =>
		bulkActivateMutation.mutate();
	const handleBulkDeactivate: NonNullable<ComponentProps<typeof MorphologyBulkBar>["onDeactivate"]> = () =>
		bulkDeactivateMutation.mutate();
	const handleBulkDelete: NonNullable<ComponentProps<typeof MorphologyBulkBar>["onDelete"]> = () =>
		bulkDeleteMutation.mutate();
return (
		<div className="flex min-h-0 flex-1 flex-col">
			<MorphologyTopbar
				onAdd={openAddModal}
				onImport={handleOpenImport}
			/>

			<div className="overflow-y-auto px-5 py-5 pb-10">
				<MorphologyStatsRow
					stats={statsQuery.data}
					isLoading={statsQuery.isLoading}
				/>

				<MorphologyToolbar
					search={search}
					pos={pos}
					type={type}
					onSearchChange={handleSearchChange}
					onPosChange={handlePosChange}
					onTypeChange={handleTypeChange}
				/>

				<MorphologyTabs
					active={status}
					stats={statsQuery.data}
					onChange={handleStatusChange}
				/>

				<MorphologyBulkBar
					count={selectedIds.size}
					activatingLoading={bulkActivateMutation.isPending}
					deactivatingLoading={bulkDeactivateMutation.isPending}
					deletingLoading={bulkDeleteMutation.isPending}
					onActivate={handleBulkActivate}
					onDeactivate={handleBulkDeactivate}
					onDelete={handleBulkDelete}
					onClear={clearSelection}
				/>

				<MorphologyTable
					items={items}
					isLoading={rulesQuery.isLoading}
					selectedIds={selectedIds}
					allSelected={allSelected}
					someSelected={someSelected}
					onToggleAll={toggleSelectAll}
					onToggleId={toggleSelectId}
					onEdit={openEditModal}
					onToggleActive={handleToggleActive}
					onDelete={handleDelete}
				/>

				<MorphologyMobileList
					items={items}
					isLoading={rulesQuery.isLoading}
					onEdit={openEditModal}
					onToggleActive={handleToggleActive}
					onDelete={handleDelete}
				/>

				{total > 0 && (
					<MorphologyPagination
						page={page}
						totalPages={totalPages}
						total={total}
						limit={LIMIT}
						onChange={setPage}
					/>
				)}
			</div>

			<MorphologyRuleModal
				open={ruleModalOpen}
				rule={editRule}
				isLoading={createMutation.isPending || updateMutation.isPending}
				onSubmit={handleRuleSubmit}
				onClose={closeRuleModal}
			/>

			<MorphologyImportModal
				open={importModalOpen}
				isLoading={importMutation.isPending}
				result={importResult}
				onSubmit={handleImportSubmit}
				onClose={handleImportClose}
			/>
		</div>
	);
};
