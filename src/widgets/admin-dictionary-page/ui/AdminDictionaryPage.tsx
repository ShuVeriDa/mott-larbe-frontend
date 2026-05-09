"use client";

import { Button } from "@/shared/ui/button";

import { ComponentProps } from 'react';
import { useI18n } from "@/shared/lib/i18n";
import { useAdminDictionaryPage } from "../model/use-admin-dictionary-page";
import { DictionaryAddExampleModal } from "./dictionary-add-example-modal";
import { DictionaryAddSenseModal } from "./dictionary-add-sense-modal";
import { DictionaryBulkBar } from "./dictionary-bulk-bar";
import { DictionaryCreateModal } from "./dictionary-create-modal";
import { DictionaryDeleteModal } from "./dictionary-delete-modal";
import { DictionaryImportModal } from "./dictionary-import-modal";
import { DictionaryMobileList } from "./dictionary-mobile-list";
import { DictionaryPagination } from "./dictionary-pagination";
import { DictionaryStatsRow } from "./dictionary-stats-row";
import { DictionaryTable } from "./dictionary-table";
import { DictionaryTabs } from "./dictionary-tabs";
import { DictionaryToolbar } from "./dictionary-toolbar";
import { DictionaryTopbar } from "./dictionary-topbar";
import { DictionaryUnknownWordsNotice } from "./dictionary-unknown-words-notice";

export const AdminDictionaryPage = () => {
	const { t, lang } = useI18n();

	const {
		tab,
		page,
		search,
		pos,
		level,
		sort,
		language,
		createOpen,
		importOpen,
		importResult,
		deleteEntry,
		addSenseEntry,
		addExampleEntry,
		selectedIds,
		listQuery,
		statsQuery,
		total,
		totalPages,
		tabCounts,
		LIMIT,
		isCreating,
		isDeleting,
		isBulkDeleting,
		isImporting,
		isAddingSense,
		isAddingExample,
		setCreateOpen,
		setDeleteEntry,
		setAddSenseEntry,
		setAddExampleEntry,
		setPage,
		handleTabChange,
		handleSearchChange,
		handlePosChange,
		handleLevelChange,
		handleSortChange,
		handleLanguageChange,
		handleSelectId,
		handleSelectAll,
		handleClearSelection,
		handleBulkDelete,
		handleBulkExport,
		handleImportOpen,
		handleImportClose,
		handleImport,
		handleCreate,
		handleDeleteConfirm,
		handleAddSenseConfirm,
		handleAddExampleConfirm,
	} = useAdminDictionaryPage();

	const items = listQuery.data?.items ?? [];
	const isEmpty = items.length === 0 && !listQuery.isLoading;
	const hasSelection = selectedIds.size > 0;
	const unknownWordsCount = statsQuery.data?.unknownWordsCount ?? 0;

		const handleClick: NonNullable<ComponentProps<"button">["onClick"]> = () => handleBulkExport();
	const handleClick2: NonNullable<ComponentProps<"button">["onClick"]> = () => setCreateOpen(true);
	const handleClose: NonNullable<ComponentProps<typeof DictionaryCreateModal>["onClose"]> = () => setCreateOpen(false);
	const handleClose2: NonNullable<ComponentProps<typeof DictionaryDeleteModal>["onClose"]> = () => setDeleteEntry(null);
	const handleConfirm: NonNullable<ComponentProps<typeof DictionaryAddSenseModal>["onConfirm"]> = def => {
					handleAddSenseConfirm(def);
					setAddSenseEntry(null);
				};
	const handleClose3: NonNullable<ComponentProps<typeof DictionaryAddSenseModal>["onClose"]> = () => setAddSenseEntry(null);
	const handleConfirm2: NonNullable<ComponentProps<typeof DictionaryAddExampleModal>["onConfirm"]> = text => {
					handleAddExampleConfirm(text);
					setAddExampleEntry(null);
				};
	const handleClose4: NonNullable<ComponentProps<typeof DictionaryAddExampleModal>["onClose"]> = () => setAddExampleEntry(null);
return (
		<div className="flex min-h-screen flex-col">
			<DictionaryTopbar
				title={t("admin.dictionary.title")}
				subtitle={t("admin.dictionary.subtitle")}
				actions={
					<>
						<Button
							onClick={handleImportOpen}
							className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
						>
							<svg
								className="size-[11px]"
								viewBox="0 0 15 15"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.4"
							>
								<path
									d="M7.5 10V1M4 4l3.5-3.5L11 4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path d="M2 12h11" strokeLinecap="round" />
							</svg>
							{t("admin.dictionary.import")}
						</Button>
						<Button
							onClick={handleClick}
							className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
						>
							<svg
								className="size-[11px]"
								viewBox="0 0 15 15"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.4"
							>
								<path
									d="M7.5 1v9M4 7l3.5 3.5L11 7"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path d="M2 12h11" strokeLinecap="round" />
							</svg>
							{t("admin.dictionary.export")}
						</Button>
						<Button
							onClick={handleClick2}
							className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-base bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88]"
						>
							<svg
								className="size-[11px]"
								viewBox="0 0 15 15"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
							>
								<path d="M7.5 2v11M2 7.5h11" />
							</svg>
							{t("admin.dictionary.create")}
						</Button>
					</>
				}
			/>

			<div className="px-5 py-5 pb-10 max-sm:px-3">
				<DictionaryStatsRow
					stats={statsQuery.data}
					isLoading={statsQuery.isLoading}
					t={t}
				/>

				<DictionaryUnknownWordsNotice
					count={unknownWordsCount}
					lang={lang}
					t={t}
				/>

				<DictionaryTabs
					active={tab}
					counts={tabCounts}
					onChange={handleTabChange}
					t={t}
				/>

				{hasSelection ? (
					<DictionaryBulkBar
						count={selectedIds.size}
						isDeleting={isBulkDeleting}
						onDelete={handleBulkDelete}
						onExport={handleBulkExport}
						onClear={handleClearSelection}
						t={t}
					/>
				) : (
					<DictionaryToolbar
						search={search}
						pos={pos}
						level={level}
						sort={sort}
						language={language}
						onSearchChange={handleSearchChange}
						onPosChange={handlePosChange}
						onLevelChange={handleLevelChange}
						onSortChange={handleSortChange}
						onLanguageChange={handleLanguageChange}
						t={t}
					/>
				)}

				<div className="overflow-hidden rounded-card border border-bd-1 bg-surf transition-colors">
					{isEmpty ? (
						<div className="py-16 text-center text-[13px] text-t-3">
							{t("admin.dictionary.empty")}
						</div>
					) : (
						<>
							<DictionaryTable
								items={items}
								isLoading={listQuery.isLoading}
								lang={lang}
								sort={sort}
								selectedIds={selectedIds}
								onSelectId={handleSelectId}
								onSelectAll={handleSelectAll}
								onSortChange={handleSortChange}
								onDelete={setDeleteEntry}
								onAddSense={setAddSenseEntry}
								onAddExample={setAddExampleEntry}
								t={t}
							/>
							<DictionaryMobileList
								items={items}
								isLoading={listQuery.isLoading}
								lang={lang}
								onDelete={setDeleteEntry}
								t={t}
							/>
						</>
					)}

					{total > 0 && (
						<DictionaryPagination
							page={page}
							totalPages={totalPages}
							total={total}
							limit={LIMIT}
							onChange={setPage}
							t={t}
						/>
					)}
				</div>
			</div>

			<DictionaryCreateModal
				open={createOpen}
				isSubmitting={isCreating}
				onSubmit={handleCreate}
				onClose={handleClose}
				t={t}
			/>

			<DictionaryImportModal
				open={importOpen}
				isSubmitting={isImporting}
				result={importResult}
				onSubmit={handleImport}
				onClose={handleImportClose}
				t={t}
			/>

			<DictionaryDeleteModal
				entry={deleteEntry}
				isDeleting={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={handleClose2}
				t={t}
			/>

			<DictionaryAddSenseModal
				entry={addSenseEntry}
				isSubmitting={isAddingSense}
				onConfirm={handleConfirm}
				onClose={handleClose3}
				t={t}
			/>

			<DictionaryAddExampleModal
				entry={addExampleEntry}
				isSubmitting={isAddingExample}
				onConfirm={handleConfirm2}
				onClose={handleClose4}
				t={t}
			/>
		</div>
	);
};
