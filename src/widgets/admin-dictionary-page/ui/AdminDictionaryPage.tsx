"use client";

import { useI18n } from "@/shared/lib/i18n";
import { useAdminDictionaryPage } from "../model/use-admin-dictionary-page";
import { DictionaryTopbar } from "./dictionary-topbar";
import { DictionaryStatsRow } from "./dictionary-stats-row";
import { DictionaryTabs } from "./dictionary-tabs";
import { DictionaryToolbar } from "./dictionary-toolbar";
import { DictionaryTable } from "./dictionary-table";
import { DictionaryMobileList } from "./dictionary-mobile-list";
import { DictionaryPagination } from "./dictionary-pagination";
import { DictionaryBulkBar } from "./dictionary-bulk-bar";
import { DictionaryCreateModal } from "./dictionary-create-modal";
import { DictionaryDeleteModal } from "./dictionary-delete-modal";

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
		deleteEntry,
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
		setCreateOpen,
		setDeleteEntry,
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
		handleCreate,
		handleDeleteConfirm,
	} = useAdminDictionaryPage();

	const items = listQuery.data?.items ?? [];
	const isEmpty = items.length === 0 && !listQuery.isLoading;
	const hasSelection = selectedIds.size > 0;

	return (
		<div className="flex min-h-screen flex-col bg-bg">
			<DictionaryTopbar
				title={t("admin.dictionary.title")}
				subtitle={t("admin.dictionary.subtitle")}
				actions={
					<>
						<button
							type="button"
							onClick={() => handleBulkExport()}
							className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[7px] border border-bd-2 bg-surf px-3 text-[12px] text-t-2 transition-colors hover:border-bd-3 hover:text-t-1"
						>
							<svg className="size-[11px]" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
								<path d="M7.5 1v9M4 7l3.5 3.5L11 7" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M2 12h11" strokeLinecap="round" />
							</svg>
							{t("admin.dictionary.export")}
						</button>
						<button
							type="button"
							onClick={() => setCreateOpen(true)}
							className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[7px] bg-acc px-3 text-[12px] font-semibold text-white transition-opacity hover:opacity-[.88]"
						>
							<svg className="size-[11px]" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
								<path d="M7.5 2v11M2 7.5h11" />
							</svg>
							{t("admin.dictionary.create")}
						</button>
					</>
				}
			/>

			<div className="px-5 py-5 pb-10 max-sm:px-3">
				<DictionaryStatsRow
					stats={statsQuery.data}
					isLoading={statsQuery.isLoading}
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

				<div className="overflow-hidden rounded-[11px] border border-bd-1 bg-surf transition-colors">
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
								selectedIds={selectedIds}
								onSelectId={handleSelectId}
								onSelectAll={handleSelectAll}
								onDelete={setDeleteEntry}
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
				onClose={() => setCreateOpen(false)}
				t={t}
			/>

			<DictionaryDeleteModal
				entry={deleteEntry}
				isDeleting={isDeleting}
				onConfirm={handleDeleteConfirm}
				onClose={() => setDeleteEntry(null)}
				t={t}
			/>
		</div>
	);
};
