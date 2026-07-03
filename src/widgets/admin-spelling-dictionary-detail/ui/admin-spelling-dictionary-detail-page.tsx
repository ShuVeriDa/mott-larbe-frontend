"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Typography } from "@/shared/ui/typography";
import { AdminCard } from "@/shared/ui/admin-card";
import { Button } from "@/shared/ui/button";
import { useI18n } from "@/shared/lib/i18n";
import {
	SpellingOccurrenceTextFilter,
	SpellingFixBar,
	SpellingFixConfirmDialog,
	SpellingOccurrencesList,
	SpellingOccurrencesPagination,
} from "@/entities/spelling-dictionary";
import { useAdminSpellingDictionaryDetailPage } from "../model/use-admin-spelling-dictionary-detail-page";
import { SpellingEntryHeaderCard } from "./spelling-entry-header-card";
import { SpellingMatchTypeFilter } from "./spelling-match-type-filter";

interface AdminSpellingDictionaryDetailPageProps {
	entryId: string;
	initialPage: number;
	initialTextIds: string[];
}

export const AdminSpellingDictionaryDetailPage = ({
	entryId,
	initialPage,
	initialTextIds,
}: AdminSpellingDictionaryDetailPageProps) => {
	const { t, lang } = useI18n();
	const {
		entry,
		items,
		total,
		page,
		limit,
		canBulkFix,
		matchTypeFilter,
		appliedMatchType,
		textIds,
		textOptions,
		textFilterSearch,
		selectedTokenIds,
		allSelected,
		someSelected,
		confirmOpen,
		fixErrorCount,
		isLoading,
		isError,
		isTextOptionsLoading,
		isFixing,
		handlePageChange,
		handleLimitChange,
		handleMatchTypeFilterChange,
		handleTextFilterChange,
		handleTextFilterSearchChange,
		handleToggleSelect,
		handleSelectAll,
		handleOpenConfirm,
		handleCloseConfirm,
		handleFixSelected,
		handleFixOne,
	} = useAdminSpellingDictionaryDetailPage({ entryId, initialPage, initialTextIds });

	const bulkFixDisabledReason =
		!canBulkFix && appliedMatchType && (appliedMatchType === "prefix" || appliedMatchType === "suffix")
			? t("admin.spellingDictionaryDetail.canBulkFixDisabledByMatchTypeTooltip")
			: undefined;

	return (
		<main className="flex min-h-0 flex-1 flex-col">
			<header className="flex items-center gap-3 border-b border-bd-1 bg-surf px-[18px] py-3 transition-colors">
				<Button variant="ghost" size="icon-sm" asChild>
					<Link href={`/${lang}/admin/spelling-dictionary`} aria-label={t("admin.spellingDictionaryDetail.back")}>
						<ArrowLeft className="size-4" />
					</Link>
				</Button>
				<Typography tag="h1" className="font-display text-[16px] text-t-1">
					{t("admin.spellingDictionaryDetail.title")}
				</Typography>
			</header>

			<div className="flex min-h-0 flex-1 flex-col gap-3 px-[18px] py-4 pb-8 max-sm:px-3 max-sm:pb-6">
				{entry && (
					<SpellingEntryHeaderCard
						wrongForm={entry.wrongForm}
						correctForm={entry.correctForm}
						matchType={entry.matchType}
						total={total}
						isLoading={isLoading}
					/>
				)}

				<AdminCard className="flex min-h-0 flex-1 flex-col">
					<div className="flex flex-wrap items-center justify-between gap-3 border-b border-bd-1 px-4 py-3">
						<Typography tag="p" className="text-[13px] font-medium text-t-1">
							{t("admin.spellingDictionaryDetail.occurrences")}
						</Typography>
						<div className="flex flex-wrap items-center gap-2">
							<SpellingMatchTypeFilter
								value={matchTypeFilter ?? null}
								onChange={handleMatchTypeFilterChange}
							/>
							<SpellingOccurrenceTextFilter
								textIds={textIds}
								options={textOptions}
								search={textFilterSearch}
								isLoading={isTextOptionsLoading}
								onChange={handleTextFilterChange}
								onSearchChange={handleTextFilterSearchChange}
							/>
						</div>
					</div>

					<SpellingFixBar
						selectedCount={selectedTokenIds.size}
						canBulkFix={canBulkFix}
						onFixSelected={handleOpenConfirm}
						disabledReason={bulkFixDisabledReason}
					/>

					{fixErrorCount > 0 && (
						<div className="border-b border-bd-1 bg-red-50 px-4 py-2 text-[12px] text-red-700">
							{t("admin.spellingDictionaryDetail.fixPartialError", { count: fixErrorCount })}
						</div>
					)}

					{isError ? (
						<div className="py-12 text-center text-[13px] text-red-500">
							{t("admin.spellingDictionaryDetail.loadError")}
						</div>
					) : (
						<div className="min-h-0 flex-1 overflow-y-auto">
							<SpellingOccurrencesList
								items={items}
								lang={lang}
								isLoading={isLoading}
								canBulkFix={canBulkFix}
								selectedTokenIds={selectedTokenIds}
								allSelected={allSelected}
								someSelected={someSelected}
								onToggleSelect={handleToggleSelect}
								onSelectAll={handleSelectAll}
								onFixOne={handleFixOne}
							/>
						</div>
					)}

					{!isLoading && total > 0 && (
						<SpellingOccurrencesPagination
							page={page}
							limit={limit}
							total={total}
							onPageChange={handlePageChange}
							onLimitChange={handleLimitChange}
						/>
					)}
				</AdminCard>
			</div>

			{entry && (
				<SpellingFixConfirmDialog
					open={confirmOpen}
					selectedCount={selectedTokenIds.size}
					wrongForm={entry.wrongForm}
					correctForm={entry.correctForm}
					isFixing={isFixing}
					onConfirm={handleFixSelected}
					onClose={handleCloseConfirm}
				/>
			)}
		</main>
	);
};
